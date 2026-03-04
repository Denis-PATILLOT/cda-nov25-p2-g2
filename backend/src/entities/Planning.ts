import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Group } from "./Group";

@ObjectType()
@Entity()
export class Planning extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  meal: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  morning_nap: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  afternoon_nap: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  morning_activities: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  afternoon_activities: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  snack: string;

  @Field()
  @Column()
  date: Date;

  @Field(() => Group, {nullable: false})
  @ManyToOne(
    () => Group,
    (group) => group.plannings,
    { onDelete: "CASCADE" },
  )
  group: Group;
}
