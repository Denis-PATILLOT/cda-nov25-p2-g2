import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Group } from "../entities/Group";
import { Planning } from "../entities/Planning";
import { NotFoundError } from "../errors"; // Ajuste le chemin
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";
import { GraphQLError } from "graphql";


@InputType()
class PlanningInput {
  @Field()
  @IsNotEmpty({message: "Le repas de midi doit être saisi"})
  meal: string;

  @Field()
  @IsNotEmpty({message: "La période de sieste du matin doit être saisi"})
  morning_nap: string;

  @Field()
  @IsNotEmpty({message: "La période de sieste de l'après-midi doit être saisi"})
  afternoon_nap: string;

  @Field()
  @IsNotEmpty({message: "Le gôuter doit être saisi"})
  snack: string;

  @Field()
  @IsDate({message: "Saisir une date correcte"})
  date: Date;

  @Field(() => Int)
  @IsNumber({allowNaN: false}, {message: "L'id du groupe doit être de type entier"})
  groupId: number;

  @Field()
  @IsNotEmpty({message: "Les activités du matin doivent être saisies"})
  morning_activities: string

  @Field()
  @IsNotEmpty({message: "Les activités de l'après-midi doivent être saisies"})
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

  @Field({nullable: true})
  morning_activities?: string

  @Field({nullable: true})
  afternoon_activities?: string
}

@Resolver()
export class PlanningResolver {
  // READ
  @Query(() => [Planning])
  async getAllPlannings(): Promise<Planning[]> {
    return await Planning.find({ relations: ["group"] });
  }

  @Query(() => [Planning])
  async getAllPlanningsByGroup(@Arg("groupId", () => Int) groupId: number): Promise<Planning[]> {
    return await Planning.find({ relations: ["group"], where: {group: { id : groupId} }, order: {date : "ASC"} });
  }

  @Query(() => Planning)
  async getPlanningById(@Arg("id", () => Int) id: number): Promise<Planning> {
    const planning = await Planning.findOne({
      where: { id: id },
      relations: ["group"],
    });

    if (!planning) throw new NotFoundError();
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
