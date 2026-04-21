import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Group } from "../entities/Group";
import { Planning } from "../entities/Planning";
import { ForbiddenError, NotFoundError } from "../errors"; // Ajuste le chemin
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";
import { GraphQLError } from "graphql";
import { GraphQLContext } from "../types";
import { getCurrentUser } from "../auth";
import { UserRole } from "../entities/User";



@InputType()
class PlanningInput {
  @Field()
  @IsNotEmpty()
  meal: string;

  @Field()
  @IsNotEmpty()
  morning_nap: string;

  @Field()
  @IsNotEmpty()
  afternoon_nap: string;

  @Field()
  @IsNotEmpty()
  snack: string;

  @Field()
  @IsDate()
  date: Date;

  @Field(() => Int)
  @IsNumber({allowNaN: false})
  groupId: number;

  @Field()
  @IsNotEmpty()
  morning_activities: string

  @Field()
  @IsNotEmpty()
  afternoon_activities: string
}

@InputType()
class UpdatePlanningInput {
  @Field({ nullable: true })
  meal?: string;

  @Field({ nullable: true })
  morning_nap?: string;

  @Field({ nullable: true })
  afternoon_nap?: string;

  @Field({ nullable: true })
  snack?: string;

  @Field({ nullable: true })
  morning_activities: string;

  @Field({ nullable: true })
  afternoon_activities: string;
}

@Resolver()
export class PlanningResolver {
  // READ
  @Query(() => [Planning])
  async getAllPlannings(): Promise<Planning[]> {
    return await Planning.find();
  }

  @Query(() => [Planning])
  async getAllPlanningsByGroup(@Arg("groupId", () => Int) groupId: number): Promise<Planning[]> {
    return await Planning.find({ relations: ["group"], where: {group: { id : groupId} }, order: {date : "ASC"} });
  }

  @Query(() => Planning)
  async getPlanningById(@Arg("id", () => Int) id: number, @Ctx() context: GraphQLContext): Promise<Planning> {

    const user = await getCurrentUser(context);

    const planning = await Planning.findOne({
      where: {id: id},
      relations: ["group"],
    });

    if (!planning) throw new NotFoundError({message: "planning is not found"});

    if(Number(planning?.group.id) !== Number(user.group?.id)) throw new ForbiddenError({message: "you can't access this planning"});

    return planning;
  }


  @Query(() => Planning)
  async getPlanningByGroupIdAndDate(@Arg("id", () => Int) id: number, @Arg("date", () => Date) date: Date): Promise<Planning> {
    const planning = await Planning.findOne({
      where: { group: {id: id }, date: date},
      relations: ["group"],
    });

    if (!planning) throw new NotFoundError();
    return planning;
  }


  // CREATE
  @Authorized(UserRole.Staff)
  @Mutation(() => Planning)
  async createPlanning(@Arg("data", {validate: true}) data: PlanningInput): Promise<Planning> {
    const group = await Group.findOneBy({ id: data.groupId });

    if (!group) {
      throw new NotFoundError({ message: "Group not found for this planning" });
    }

    const PlanningExistsAlready = await Planning.findOne({ 
        relations: ["group"], 
        where : { date : data.date, group: group },
      });
    if(PlanningExistsAlready) {
      throw new GraphQLError("Planning already exists with this date", {
        extensions: { code: "INVALID DATE", http: { status: 400 } } });
    }

    const newPlanning = Planning.create({
      ...data,
      group: group,
    });

    return await newPlanning.save();
  }

  // UPDATE
  @Authorized(UserRole.Staff)
  @Mutation(() => Planning)
  async updatePlanning(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: UpdatePlanningInput,
  ): Promise<Planning> {
    const planning = await Planning.findOneBy({ id: id });

    if (!planning) {
      throw new NotFoundError({ message: "Planning not found" });
    }

    // Utilisation de Object.assign (en filtrant les undefined)
    const updates = JSON.parse(JSON.stringify(data));
    Object.assign(planning, updates);

    return await planning.save();
  }

  // DELETE
  @Mutation(() => Boolean)
  async deletePlanning(@Arg("id", () => Int) id: number): Promise<boolean> {
    const result = await Planning.delete(id);

    if (result.affected === 0) {
      throw new NotFoundError({ message: "Planning to delete not found" });
    }

    return true;
  }
}
