import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Group } from "./Group";

@ObjectType()
@Entity()
export class Planning extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "text" })
  meal: string;

  @Field()
  @Column({ type: "text" })
  morning_nap: string;

  @Field()
  @Column({ type: "text" })
  afternoon_nap: string;

  @Field()
  @Column({ type: "text" })
  morning_activities: string;

  @Field()
  @Column({ type: "text" })
  afternoon_activities: string;

  @Field()
  @Column({ type: "text" })
  snack: string;

  @Field()
  @Column()
  date: Date;

  @Field(() => Group, {nullable: false})
  @ManyToOne(
    () => Group,
    (group) => group.plannings,
    { onDelete: "CASCADE", nullable: false },
  )
  group: Group;
}
