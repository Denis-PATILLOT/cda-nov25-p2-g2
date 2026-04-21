import { IsBoolean, IsDate, IsISO8601, IsUrl } from "class-validator";
import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectId } from "../types";
import { Child } from "./Child";

export enum baby_moodFormat {
  Bad = "bad",
  Neutral = "neutral",
  Good = "good",
  NA = "na", // gestion d'une absence donc pas de mood = NA
}

registerEnumType(baby_moodFormat, {
  name: "baby_moodFormat",
});

@ObjectType()
@Entity()
export class Report extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "boolean" })
  isPresent: boolean;

  @Field()
  @Column()
  date: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: "text" })
  staff_comment?: string | null;

  @Field()
  @Column({
    type: "enum",
    enum: baby_moodFormat,
    default: baby_moodFormat.NA,
  })
  baby_mood: baby_moodFormat;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: "text" })
  picture?: string | null;

  @Field(() => Child)
  @ManyToOne(
    () => Child,
    (child) => child.reports,
  )
  child: Child;
}

@InputType()
export class NewReportInput {
  @Field(() => Boolean)
  @IsBoolean({ message: "La présence doit être un booléen" })
  isPresent: boolean;

  @Field()
  @IsDate({message: "format de date incorrect"})
  date: Date;

  @Field(() => String, { nullable: true })
  staff_comment?: string | null;

  @Field({defaultValue: baby_moodFormat.NA})
  baby_mood: baby_moodFormat;

  @Field(() => String, { nullable: true })
  @IsUrl({}, { message: "Le format attendu doit être une url" })
  picture?: string | null;

  @Field(() => ObjectId, { nullable: true })
  child: ObjectId;
}

@InputType()
export class UpdateReportInput {
  @Field(() => Boolean)
  @IsBoolean({ message: "La présence doit être un booléen" })
  isPresent?: boolean;

  @Field()
  @IsDate({message: "format de date incorrect"})
  date?: Date;

  @Field(() => String, { nullable: true })
  staff_comment?: string | null;

  @Field()
  baby_mood?: baby_moodFormat;

  @Field(() => String, { nullable: true })
  @IsUrl({}, { message: "Le format attendu doit être une url" })
  picture?: string | null;

  @Field(() => ObjectId, { nullable: true })
  child?: ObjectId;
}
