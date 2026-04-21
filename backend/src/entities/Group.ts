import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Child } from "./Child";
import { Planning } from "./Planning";
import { User } from "./User";

@ObjectType()
@Entity()
export class Group extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "varchar", length: 100 })
  name: string;

  @Field(() => Int)
  @Column({ type: "int" })
  capacity: number;

  // Un groupe peut avoir plusieurs plannings
  @Field(() => [Planning], { nullable: true })
  @OneToMany(
    () => Planning,
    (planning) => planning.group,
  )
  plannings: Planning[];

  @Field(() => [Child], { nullable: true })
  @OneToMany(
    () => Child,
    (child) => child.group,
  )
  children: Child[];

  @Field(() => [User])
  @OneToMany(
    () => User,
    (user) => user.group,
  )
  staff: User[];
}
