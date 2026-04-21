import {
  Authorized,
  Ctx,
  Field,
  Int,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import db from "../db";
import { Child } from "../entities/Child";
import { User, UserRole } from "../entities/User";
import { GraphQLContext } from "../types";
import { getCurrentUser } from "../auth";

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

  @Authorized(UserRole.Admin)
  @Query(() => [User])
  async allParentsWithAdminConverations(@Ctx() context: GraphQLContext)  {  // on en a besoin pour filter les conversations pour prendre que celles des parents avec l'admin
    const adminUser = await getCurrentUser(context);

    // const userRepo = db.getRepository(User);
    const parents =  await User.find({
      relations: { children: { group: true  }, startedConversations : {participant: true}, participatedConversations: {initiator: true} },
      where: { role: UserRole.Parent }
    });

    // on renvoie les infos des parents avec seulement les conversations avec le user connecté (ici l'admin)
    return parents.map(p => ({...p, startedConversations: p.startedConversations.filter(c => c.participant.id === adminUser.id), participatedConversations : p.participatedConversations.filter(c => c.initiator.id === adminUser.id)}));
    
  }
}