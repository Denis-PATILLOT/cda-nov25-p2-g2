import { IsDate, IsUrl, Length } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectId } from "../types";
import { Group } from "./Group";
import { Report } from "./Report";
import { User } from "./User";

@ObjectType()
@Entity()
export class Child extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 50 })
  firstName: string;

  @Field()
  @Column({ length: 100 })
  lastName: string;

  @Field()
  @CreateDateColumn()
  birthDate: Date;

  @Field()
  @Column({ type: "text" })
  picture: string;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  healthRecord: string | null;

  // Child relations
  @Field(() => Group)
  @ManyToOne(
    () => Group,
    (group) => group.children,
  )
  group: Group; // FK

  @Field(() => [Report])
  @OneToMany(
    () => Report,
    (report) => report.child,
  )
  reports: Report[];

  @Field(() => [User])
  @ManyToMany(
    () => User,
    (user) => user.children,
  )
  parents: User[];
}

@InputType()
export class NewChildInput {
  @Field()
  @Length(3, 50, {
    message: "Le prénom doit contenir entre 3 et 50 caractères",
  })
  firstName: string;

  @Field()
  @Length(2, 50, { message: "Le nom doit contenir entre 2 et 100 caractères" })
  lastName: string;

  @Field()
  @IsDate({ message: "La date est  de format incorrect" })
  birthDate: Date;

  @Field()
  @IsUrl({}, { message: "Le format attendu doit être une url" })
  picture: string;

  @Field({ nullable: true })
  healthRecord?: string;

  @Field(() => ObjectId)
  group: ObjectId;

  @Field(() => [ObjectId])
  parents: ObjectId[];
}

@InputType()
export class UpdateChildInput {
  @Field({ nullable: true })
  @Length(3, 50, {
    message: "Le prénom doit contenir entre 3 et 50 caractères",
  })
  firstName?: string;

  @Field({ nullable: true })
  @Length(2, 50, { message: "Le nom doit contenir entre 2 et 100 caractères" })
  lastName?: string;

  @Field({ nullable: true })
  @IsDate({ message: "La date est  de format incorrect" })
  birthDate?: Date;

  @Field({ nullable: true })
  @IsUrl({}, { message: "Le format attendu doit être une url" })
  picture?: string;

  @Field({ nullable: true })
  healthRecord?: string;

  @Field(() => ObjectId, { nullable: true })
  group?: ObjectId;

  @Field(() => [ObjectId], { nullable: true })
  parents?: ObjectId[];
}
