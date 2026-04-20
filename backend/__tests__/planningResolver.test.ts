import assert from "node:assert";
import gql from "graphql-tag";
import { execute } from "../jest.setup";
import { Planning } from "../src/entities/Planning";
import { Group } from "../src/entities/Group";
import { createStaff } from "./helpers/createStaff";
import { createParent } from "./helpers/createParent";
import { getUserContext } from "./helpers/getUserContext";


describe("PlanningResolver", () => {
  it("should create a Planning and retrieve it", async () => {
    const group1 = await Group.create({name: "Petite section", capacity: 8 }).save();
    await Planning.create({
      meal: "soupe",
      snack: "pain",
      morning_activities: "cache-cache",
      afternoon_activities: "peinture",
      morning_nap: "9h30-10h00",
      afternoon_nap: "14h00-14h30",
      group: group1,
      date: new Date("2026-04-01"),
    }).save();
    const res: any = await execute(gql`
        query AllPlannings{
            getAllPlannings  {
            id 
            meal
            snack
            morning_activities
            morning_nap
            afternoon_activities
            afternoon_nap
            date
            } 
        } 
    `);
    assert(res.body.kind === "single");
    expect(res.body.singleResult.errors).toBeUndefined();
    expect(res.body.singleResult.data?.getAllPlannings).toHaveLength(1);
    expect(res.body.singleResult.data?.getAllPlannings?.[0].id).toBe(1); 
    expect(res.body.singleResult.data?.getAllPlannings?.[0].meal).toBe("soupe");
    expect(res.body.singleResult.data?.getAllPlannings?.[0].snack).toBe("pain");
    expect(res.body.singleResult.data?.getAllPlannings?.[0].morning_activities).toBe("cache-cache");
    expect(res.body.singleResult.data?.getAllPlannings?.[0].afternoon_activities).toBe("peinture");
    expect(res.body.singleResult.data?.getAllPlannings?.[0].morning_nap).toBe("9h30-10h00");
    expect(res.body.singleResult.data?.getAllPlannings?.[0].afternoon_nap).toBe("14h00-14h30");
    expect(res.body.singleResult.data?.getAllPlannings?.[0].date).toBe("2026-04-01T00:00:00.000Z");

  });

  it("should not create a Planning with bad data", async () => {
    const staffMember = await createStaff();
    const group1 = await Group.create({name: "Petite section", capacity: 8 }).save();
    const res = await execute(gql`
        mutation CreatePlanning($data: PlanningInput!) {
            createPlanning(data: $data)  {
            id 
            meal
            snack
            morning_activities
            morning_nap
            afternoon_activities
            afternoon_nap
            date
            } 
            
        } 
    `, 
    {
        data: {
            meal: "",
            snack: "éclair chocolat",
            morning_activities: "comptines",
            afternoon_activities: "jeux dehors",
            morning_nap:"9h-9h30",
            afternoon_nap: "14h-14h30",
            date: new Date("2026-04-01"),
            groupId: 1
        }
    },    
      await getUserContext(staffMember)
    );

    expect(res).toMatchInlineSnapshot(`
{
  "body": {
    "kind": "single",
    "singleResult": {
      "data": null,
      "errors": [
        {
          "extensions": {
            "code": "BAD_USER_INPUT",
            "validationErrors": [
              ValidationError {
                "children": [],
                "constraints": {
                  "isNotEmpty": "meal should not be empty",
                },
                "property": "meal",
                "target": PlanningInput {
                  "afternoon_activities": "jeux dehors",
                  "afternoon_nap": "14h-14h30",
                  "date": 2026-04-01T00:00:00.000Z,
                  "groupId": 1,
                  "meal": "",
                  "morning_activities": "comptines",
                  "morning_nap": "9h-9h30",
                  "snack": "éclair chocolat",
                },
                "value": "",
              },
            ],
          },
          "locations": [
            {
              "column": 3,
              "line": 2,
            },
          ],
          "message": "Argument Validation Error",
          "path": [
            "createPlanning",
          ],
        },
      ],
    },
  },
  "http": {
    "headers": Map {
      "cache-control" => "no-store",
    },
    "status": undefined,
  },
}
`);
   
  });

  it("should not create a Planning with a bad role", async () => {
    const parentMember = await createParent();
    const group1 = await Group.create({name: "Petite section", capacity: 8 }).save();
    const res = await execute(gql`
        mutation CreatePlanning($data: PlanningInput!) {
            createPlanning(data: $data)  {
            id 
            meal
            snack
            morning_activities
            morning_nap
            afternoon_activities
            afternoon_nap
            date
            } 
            
        } 
    `, 
    {
        data: {
            meal: "soupe",
            snack: "éclair chocolat",
            morning_activities: "comptines",
            afternoon_activities: "jeux dehors",
            morning_nap:"9h-9h30",
            afternoon_nap: "14h-14h30",
            date: new Date("2026-04-01"),
            groupId: 1
        }
    },    
      await getUserContext(parentMember)
    );

    expect(res).toMatchInlineSnapshot(`
{
  "body": {
    "kind": "single",
    "singleResult": {
      "data": null,
      "errors": [
        {
          "extensions": {
            "code": "FORBIDDEN",
          },
          "locations": [
            {
              "column": 3,
              "line": 2,
            },
          ],
          "message": "You are not allowed to perform this operation",
          "path": [
            "createPlanning",
          ],
        },
      ],
    },
  },
  "http": {
    "headers": Map {
      "cache-control" => "no-store",
    },
    "status": 403,
  },
}
`);
  })
});

