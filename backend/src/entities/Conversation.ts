import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Message } from "./Message";
import { User } from "./User";

@ObjectType()
@Entity()
export class Conversation extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn()
  creationDate: Date;

  @Field(() => User)
  @ManyToOne(() => User, initiator => initiator.startedConversations)
  initiator: User;

  @Field(() => User)
  @ManyToOne(() => User, participant => participant.participatedConversations)
  participant: User;

  @Field(() => [Message])
  @OneToMany(() => Message, message => message.conversation)
  messages: Message[];
}
