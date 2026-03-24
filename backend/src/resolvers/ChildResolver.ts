import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { getCurrentUser } from "../auth";
import db from "../db";
import { Child, NewChildInput, UpdateChildInput } from "../entities/Child";
import { Report } from "../entities/Report";
import { User } from "../entities/User";
import { ForbiddenError, NotFoundError } from "../errors";
import type { GraphQLContext } from "../types";

@Resolver()
export default class ChildResolver {
  @Query(() => [Child])
  async children() {
    return await Child.find({
      relations: ["group", "reports", "parents"],
    });
  }

  @Query(() => [Child])
  async childrenByGroup(
    @Arg("groupId", () => Int) groupId: number,
    @Ctx() context: GraphQLContext,
  ) {
    // avoir les parents des enfants du groupe

    const user = await getCurrentUser(context);

    if (user.group?.id !== groupId)
      throw new ForbiddenError({
        message: "You can't access these informations",
      });

    return await Child.find({
      relations: [
        "group",
        "parents",
        "parents.startedConversations",
        "parents.startedConversations.participant",
        "parents.participatedConversations",
        "parents.participatedConversations.initiator",
      ],
      where: { group: { id: groupId } },
    });
  }

  @Query(() => Child)
  async child(
    @Arg("id", () => Int) id: number,
    @Ctx() context: GraphQLContext,
  ) {
    const user = await getCurrentUser(context);

    const child = await Child.findOne({
      where: { id },
      relations: ["group", "reports", "parents", "group.plannings"],
      order: {
        reports: {
          // pour avoir les reports en ordre choronologique
          date: "ASC",
        },
      },
    });

    if (!child) {
      throw new NotFoundError();
    }

    if (user.role === "staff" &&child.group.id !== user.group?.id)
      throw new ForbiddenError({ message: "you can't access this child" });
    if (
      user.role === "parent" &&
      !user.children?.map((child) => child.id).includes(child.id)
    ) {
      throw new ForbiddenError({ message: "You can't access this report" });
    }

    return child;
  }

  @Mutation(() => Child)
  async createChild(
    @Arg("data", () => NewChildInput, { validate: true }) data: NewChildInput,
  ) {
    const newChild = new Child();

    Object.assign(newChild, data);
    const { id } = await newChild.save();
    return Child.findOne({
      where: { id },
      relations: ["group", "reports", "parents"],
    });
  }

  @Mutation(() => Child)
  async updateChild(
    @Arg("id", () => Int) id: number,
    @Arg("data", () => UpdateChildInput, { validate: true })
    data: UpdateChildInput,
  ) {
    const childToUpdate = await Child.findOne({
      where: { id },
      relations: ["group", "reports", "parents"],
    });

    if (!childToUpdate) {
      throw new NotFoundError();
    }

    Object.assign(childToUpdate, data);
    await childToUpdate.save();
    return await Child.findOne({
      where: { id },
      relations: ["group", "reports", "parents"],
    });
  }

  @Mutation(() => String)
  async deleteChild(@Arg("id", () => Int) id: number) {
    const childToDelete = await Child.findOne({
      where: { id },
      relations: ["group", "reports", "parents"],
    });

    if (!childToDelete) {
      throw new NotFoundError();
    }

    // Nettoyer la table de jointure representatives (ManyToMany avec User)
    if (childToDelete.parents?.length) {
      const parentIds = childToDelete.parents.map((p) => p.id);
      await db
        .getRepository(User)
        .createQueryBuilder()
        .relation(User, "children")
        .of(parentIds)
        .remove(childToDelete.id);
    }
    // Supprimer les reports liés avant l'enfant (contrainte FK)
    if (childToDelete.reports?.length) {
      await Report.remove(childToDelete.reports);
    }
    await childToDelete.remove();
    return "Child has been deleted correctly !";
  }
}
