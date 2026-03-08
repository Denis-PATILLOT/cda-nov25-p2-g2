import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import db from "../db";
import { Child, NewChildInput, UpdateChildInput } from "../entities/Child";
import { Report } from "../entities/Report";
import { User } from "../entities/User";
import { NotFoundError } from "../errors";

@Resolver()
export default class ChildResolver {
  @Query(() => [Child])
  async children() {
    return await Child.find({
      relations: ["group", "reports", "parents"],
    });
  }

  @Query(() => Child)
  async child(@Arg("id", () => Int) id: number) {
    const child = await Child.findOne({
      where: { id },
      relations: ["group", "reports", "parents"],
    });

    if (!child) {
      throw new NotFoundError();
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
      await db.getRepository(User)
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
