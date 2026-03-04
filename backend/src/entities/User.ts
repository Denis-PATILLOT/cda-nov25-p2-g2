import { IsEmail, IsOptional, IsStrongPassword, Length } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Child } from "./Child";
import { Group } from "./Group";

export const UserRole = {
  Admin: "admin",
  Staff: "staff",
  Parent: "parent",
} as const;

export type Role = (typeof UserRole)[keyof typeof UserRole];

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Field()
  @Column({ type: "varchar", length: 50 })
  first_name!: string;

  @Field()
  @Column({ type: "varchar", length: 100 })
  last_name!: string;

  @Field()
  @Column({ type: "varchar", length: 20 })
  phone: string;

  @Column({ name: "password", type: "text" })
  hashedPassword: string;

  @Field()
  @CreateDateColumn()
  creation_date: Date;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  avatar: string;

  @Field()
  @Column({ type: "varchar", length: 50, default: UserRole.Parent })
  role: Role;

  @Field(() => Group, { nullable: true })
  @ManyToOne(
    () => Group,
    (group) => group.staff,
  )
  @JoinColumn({ name: "group_id" })
  group: Group | null;

  @Field(() => [Child], { nullable: true })
  @JoinTable({ name: "representatives" })
  @ManyToMany(
    () => Child,
    (child) => child.parents,
  )
  children?: Child[];
}

// Admin crée les comptes avec mdp temporaire
@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @Field()
  @Length(2, 50, {
    message: "Le prénom doit contenir entre 2 et 50 caractères",
  })
  first_name: string;

  @Field()
  @Length(2, 100, { message: "Le nom doit contenir entre 2 et 100 caractères" })
  last_name: string;

  @Field()
  @Length(8, 20, {
    message: "Le numéro de téléphone doit contenir entre 8 et 20 caractères",
  })
  phone: string;

  @Field()
  @IsStrongPassword(
    {},
    {
      message:
        "Le mot de passe doit contenir au moins 8 caractères, dont une minuscule, une majuscule, un chiffre et un caractère spécial",
    },
  )
  password: string;

  @Field()
  role: Role; // parent / staff

  @Field(() => Int, { nullable: true })
  group_id: number | null;
}

// Tout le monde peut se connecter et changer son mdp
@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @Field()
  @IsStrongPassword(
    {},
    {
      message:
        "Le mot de passe doit contenir au moins 8 caractères, dont une minuscule, une majuscule, un chiffre et un caractère spécial",
    },
  )
  password: string;
}
// L'utilisateur peut changer son mot passe ensuite
@InputType()
export class ChangePasswordInput {
  @Field()
  currentPassword!: string;

  @Field()
  @IsStrongPassword(
    {},
    {
      message:
        "Le nouveau mot de passe doit contenir au moins 8 caractères, dont une minuscule, une majuscule, un chiffre et un caractère spécial",
    },
  )
  newPassword!: string;
}
// Mise à jour des informations de l'utilisateur, les champs tous nullable sauf id car sinon on oblige l'admin à tout resaisir pour faire une modification
@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail({}, { message: "L'email doit être valide" })
  email?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(2, 50)
  first_name?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(2, 100)
  last_name?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(8, 20, {
    message: "Le numéro de téléphone doit contenir entre 8 et 20 caractères",
  })
  phone?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  avatar?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  role?: Role | null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  group_id?: number | null;
}
