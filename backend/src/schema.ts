import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import { AdminResolver } from "./resolvers/AdminResolver";
import ChildResolver from "./resolvers/ChildResolver";
import ConversationResolver from "./resolvers/ConversationResolver";
import { GroupResolver } from "./resolvers/GroupResolver";
import MessageResolver from "./resolvers/MessageResolver";
import { PlanningResolver } from "./resolvers/PlanningResolver";
import ReportResolver from "./resolvers/ReportResolver";
import UserResolver from "./resolvers/UserResolver";

export async function getSchema() {
  return buildSchema({
    resolvers: [
      UserResolver,
      ReportResolver,
      ChildResolver,
      GroupResolver,
      ConversationResolver,
      MessageResolver,
      PlanningResolver,
      AdminResolver,
    ],
    authChecker,
  });
}
