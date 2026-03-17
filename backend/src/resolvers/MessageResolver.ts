import { IsNotEmpty } from "class-validator";
import { Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { getCurrentUser } from "../auth";
import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";
import { ForbiddenError, NotFoundError } from "../errors";
import type { GraphQLContext } from "../types";

@InputType()

export class CreateMessageInput {
  @Field()
  @IsNotEmpty({ message: "content can't be empty" })
  content: string;

  @Field(() => Int)
  @IsNotEmpty({message: "conversation id must be indicated"})
  conversationId: number;
}

@Resolver()
export default class MessageResolver {
  @Query(() => [Message])
  async messagesFromConversation(@Arg("conversationId", () => Int) conversationId: number, @Ctx() context: GraphQLContext) {
    
    const currentUser = await getCurrentUser(context);
    
    const conversation = await Conversation.findOne({
      where: { id: conversationId },
      relations: ["initiator", "participant"],
    });

    if (!conversation) {
      throw new NotFoundError({ message: "conversation not found" });
    }

    // l'utiliateur connecté doit faire parti de la conversation
    if (conversation.initiator.id !== currentUser.id && conversation.participant.id !== currentUser.id) {
      throw new ForbiddenError({ message: "you can't access this conversation" });
    }

    // Récupère les messages de la conversation selon l'ordre chronologique
    const messages = await Message.find({
      where: { conversation: { id: conversationId } },
      relations: ["author", "conversation"],
      order: { date: "ASC" },
    });

    return messages;
  }

  // Crée un nouveau message dans une conversation
  @Mutation(() => Message)
  async createMessage(
    @Arg("data", () => CreateMessageInput, { validate: true }) data: CreateMessageInput, @Ctx() context: GraphQLContext) {
    const currentUser = await getCurrentUser(context);

    const conversationFound = await Conversation.findOne({
      where: { id: data.conversationId },
      relations: ["initiator", "participant"],
    });

    if (!conversationFound) {
      throw new NotFoundError({ message: "conversation not found" });
    }

    // l'utiliateur connecté doit faire parti de la conversation
    if (conversationFound.initiator.id !== currentUser.id && conversationFound.participant.id !== currentUser.id) {
      throw new ForbiddenError({ message: "you can't access this conversation" });
    }

    const newMessage = Message.create({
      content: data.content,
      author: currentUser,
      conversation: conversationFound,
    });

    return await newMessage.save();
  }
}
