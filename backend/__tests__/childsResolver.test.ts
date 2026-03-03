import assert from "node:assert";
import gql from "graphql-tag";
import { execute } from "../jest.setup";
import { Child } from "../src/entities/Child";

describe("ChildResolver", () => {
  it("should create a child and retrieve it", async () => {
    await Child.create({
      firstName: "Test Child",
      lastName: "Test Last Name",
      picture: "test.jpg",
      birthDate: new Date("2020-01-01"),
    }).save();
    const res: any = await execute(gql`
query children{
children  {
id firstName
 lastName 
 picture 
 birthDate } 
 } `);
    assert(res.body.kind === "single");
    expect(res.body.singleResult.errors).toBeUndefined();
    expect(res.body.singleResult.data?.children).toHaveLength(1);
    expect(res.body.singleResult.data?.children?.[0].firstName).toBe(
      "Test Child",
    );
    expect(res.body.singleResult.data?.children?.[0].lastName).toBe(
      "Test Last Name",
    );
    expect(res.body.singleResult.data?.children?.[0].birthDate).toBe(
      "2020-01-01T00:00:00.000Z",
    );
    expect(res.body.singleResult.data?.children?.[0].picture).toBe("test.jpg");
  });
});
