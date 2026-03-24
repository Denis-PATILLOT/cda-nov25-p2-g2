import { Arg, Ctx, ID, Int, Mutation, Query, Resolver } from "type-graphql";
import { baby_moodFormat, NewReportInput, Report, UpdateReportInput } from "../entities/Report";
import { ForbiddenError, NotFoundError } from "../errors";
import { Child } from "../entities/Child";
import { GraphQLError } from "graphql/error";
import { GraphQLContext } from "../types";
import { getCurrentUser } from "../auth";

@Resolver()
export default class ReportResolver {
  // afficher tous les reports
  @Query(() => [Report])
  async reports() {
    return Report.find({
      relations: ["child", "child.group"],
      order: { date: "DESC" },
    });
  }

  // afficher un seul report
  @Query(() => Report, { nullable: true })
  async report(@Arg("id", () => Int) id: number, @Ctx() context: GraphQLContext) {
    
    const user = await getCurrentUser(context);
    
    const report =  await Report.findOne({
      relations: {
        child : {
          group : {
            plannings: true
            } 
          }
        },
        where: {id} 
    });

    if(!report) throw new NotFoundError({message: "Report not found"});

    if (user.group?.id !== report.child.group.id) throw new ForbiddenError({message: "You can't access this report"})
    
    return report;
  };

  // créer un report
  @Mutation(() => Report)
  async createReport(
    @Arg("data", () => NewReportInput, { validate: true })
    data: NewReportInput,
  ): Promise<Report> {
    const child = await Child.findOne({
      where: { id: data.child?.id },
      relations: ["group", "group.plannings", "group.plannings.group"]
    });
    if (!child) throw new NotFoundError();

    const reportExistsAlready = await Report.findOne({ 
      relations: ["child"], 
      where : { date : data.date, child: data.child },
    });
    if(reportExistsAlready) throw new GraphQLError("Report already exists for this child", {extensions: { code: "REPORT ALREADY EXISTED", argumentName: "report" }});

    const existingPlanning = child.group.plannings.some(p => p.date.toISOString() === data.date.toISOString());  // comparaison de date avec passage en string (car sinon 2 objets date ne seront jamais égaux entre eux !)
    if(!existingPlanning) throw new GraphQLError(`No planning existed for that date and group : ${new Date(data.date).toLocaleDateString("FR-fr")}`);

    const newReport = new Report();
    Object.assign(newReport, data);
    
    await newReport.save();
    return newReport;
  }

  //  modifier un report
  @Mutation(() => Report)
  async updateReport(
    @Arg("id", () => Int) id: number,
    @Arg("data", () => UpdateReportInput, { validate: true })
    data: UpdateReportInput,
  ): Promise<Report> {
    const reportToUpdate = await Report.findOne({
      where: { id },
      relations: ["child"],
    });

    if (!reportToUpdate) throw new NotFoundError();

    // si pas présent (champ inaccessible dans data car pas coché dans le formulaire), on vide les données inutiles
    if(!data.isPresent ) {
      data.baby_mood = baby_moodFormat.NA;
      data.picture = null;
      data.staff_comment = null;
    }

    Object.assign(reportToUpdate, data);
    await reportToUpdate.save();

    return reportToUpdate;
  }
}
