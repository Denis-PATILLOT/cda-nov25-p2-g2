import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { getCurrentUser } from "../auth";
import { Conversation } from "../entities/Conversation";
import { User } from "../entities/User";
import { ForbiddenError, NotFoundError, UnauthenticatedError } from "../errors";
import type { GraphQLContext } from "../types";


@Resolver()
export default class ConversationResolver {
  @Query(() => [Conversation])
  async myConversations(@Ctx() context: GraphQLContext) { 
    
    const currentUser = await getCurrentUser(context); // utilisateur courant
    // Récupère toutes les conversations où l'utilisateur est soit l'initiator, soit le participant
    if(currentUser.role === "staff" || currentUser.role === "parent" || currentUser.role === "admin") {
      const conversations = await Conversation.find({
        where: [
          { initiator: { id: currentUser.id } },
          { participant: { id: currentUser.id } }
        ],
        relations: ["initiator", "participant", "messages", "messages.author", "initiator.children", "participant.children", "initiator.children.group", "participant.children.group"],
        order: { creationDate: "DESC" },
      });
  
      return conversations;
    }
    throw new UnauthenticatedError();
  }

  // récupération d'une conversation via son id, avec chaque message et leur auteur
  @Query(() => Conversation, { nullable: true })
  async conversation(
    @Arg("id", () => Int) id: number,
    @Ctx() context: GraphQLContext,
  ) {
    const currentUser = await getCurrentUser(context);

    const conversation = await Conversation.findOne({
      where: { id },
      relations: ["initiator", "participant", "messages", "messages.author", "initiator.children", "initiator.children.group", "participant.children", "participant.children.group"],
      order: { messages : { date: "ASC"} }
    });

    if (!conversation) {
      throw new NotFoundError({ message: "Conversation is not found" });
    }

    // l'utilisateur courant doit faire partie de la conversation
    if (
      conversation.initiator.id !== currentUser.id &&
      conversation.participant.id !== currentUser.id
    ) {
      throw new ForbiddenError({
        message: "you can't access this conversation (you're not part of it)",
      });
    }
    return conversation;
  }

  @Mutation(() => Conversation)
  async createConversation(
    @Arg("participantId", () => Int) participantId: number,
    @Arg("initiatorId", () => Int) initiatorId: number,
    @Ctx() context: GraphQLContext,
  ) {
    const currentUser = await getCurrentUser(context);

    if(currentUser.id !== initiatorId) {
      throw new ForbiddenError({message: "You don't have the right to create a conversation"})
    }

    if (currentUser.id === participantId) {
      throw new ForbiddenError({ message: "you can't be the creator and the participant at same time" });
    }

    const participant = await User.findOne({ where: { id: participantId } });
    if (!participant) {
      throw new NotFoundError({ message: "User not found" });
    }

    // Vérifie qu'une conversation n'existe pas déjà entre les deux utilisateurs de notre future conversation
    const existingConversation = await Conversation.findOne({
      where: [
        {
          initiator: { id: initiatorId },
          participant: { id: participantId },
        },
        {
          initiator: { id: participantId },
          participant: { id: initiatorId },
        },
      ],
    });

    if (existingConversation) {
      throw new ForbiddenError({ message: "A conversation already exists with these participants" });
    }

    const newConversation = Conversation.create({  // si ok, on crée la conversation
      initiator: currentUser,
      participant: participant,
    });

    return await newConversation.save();
  }
}
