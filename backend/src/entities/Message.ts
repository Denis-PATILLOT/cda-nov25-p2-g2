import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Conversation } from "./Conversation";
import { User } from "./User";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  content: string;

  @Field()
  @CreateDateColumn()
  date: Date;

  @Field(() => User)
  @ManyToOne(() => User, author => author.messages)
  author: User;

  @Field(() => Conversation)
  @ManyToOne(() => Conversation, conversation => conversation.messages)
  conversation: Conversation;
}
