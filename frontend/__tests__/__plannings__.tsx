import { MockedProvider } from "@apollo/client/testing/react";
import { render, screen } from "@testing-library/react";
import { GetAllPlanningsByGroupDocument } from "@/graphql/generated/schema";
import StaffPlanning from "@/pages/staff/planning";

/*
GetAllPlanningsByGroupDocument = gql`
    query getAllPlanningsByGroup($groupId: Int!) {
  getAllPlanningsByGroup(groupId: $groupId) {
    id
    date
    morning_activities
    morning_nap
    meal
    afternoon_activities
    afternoon_nap
    snack
  }
}
  */

const planningsMock = {
  request: {
    query: GetAllPlanningsByGroupDocument,
    variables : {
        groupId: 1
    }
  },
  result: {
    data: {
      getAllPlanningsByGroup: [{
        id: "1",
        date: "2026-03-09T00:00:00.000Z",
        morning_activities: "Peinture",
        morning_nap: "9h30 - 10h00",
        meal: "salade verte - lentilles - fromage blanc - pomme",
        afternoon_activities: "comptines",
        afternoon_nap: "14h30 - 15h00",
        snack: "pain et barre chocolat",
      }]
    },
  },
};

jest.mock("next/router", () => ({
  useRouter() {
    return {
      push: () => jest.fn(), // méthode utilisée Header
      query: {
        id: 1
      }
    };
  },
}));

describe("Plannings page test", () => {
  it("contains a heading element in Plannings page", async () => {
    render(
      <MockedProvider mocks={[planningsMock]}>
        <StaffPlanning />
      </MockedProvider>,
    );
    screen.debug();
    // expect(await screen.findByText("Plannings")).toBeVisible();
  });
});
