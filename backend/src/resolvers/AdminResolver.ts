import {
  Authorized,
  Field,
  Int,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import db from "../db";
import { Child } from "../entities/Child";
import { User, UserRole } from "../entities/User";

@ObjectType()
class AdminCounts {
  @Field(() => Int)
  childrenCount!: number;

  @Field(() => Int)
  staffCount!: number;

  @Field(() => Int)
  parentCount!: number;
}

@Resolver()
export class AdminResolver {
  @Authorized(UserRole.Admin)
  @Query(() => [User])
  async allStaff(): Promise<User[]> {
    const userRepo = db.getRepository(User);
    return await userRepo.find({
      where: { role: UserRole.Staff },
      relations: { group: true },
    });
  }

  @Authorized(UserRole.Admin)
  @Query(() => [User])
  async allParents(): Promise<User[]> {
    const userRepo = db.getRepository(User);
    return await userRepo.find({
      where: { role: UserRole.Parent },
      relations: { children: { group: true, parents: true } },
    });
  }

  @Authorized(UserRole.Admin)
  @Query(() => AdminCounts)
  async adminCounts(): Promise<AdminCounts> {
    const childRepo = db.getRepository(Child);
    const userRepo = db.getRepository(User);
    const childrenCount = await childRepo.count();
    const staffCount = await userRepo.count({
      where: { role: UserRole.Staff },
    });
    const parentCount = await userRepo.count({
      where: { role: UserRole.Parent },
    });
    return { childrenCount, staffCount, parentCount };
  }
}
