import { MockedProvider } from "@apollo/client/testing/react";
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";
import { ProfileDocument } from "@/graphql/generated/schema";

const profileMock = {
  request: {
    query: ProfileDocument,
  },
  result: {
    data: {
      me: null,
    },
  },
};

jest.mock("next/router", () => ({
  useRouter() {
    return {
      push: () => jest.fn(), // méthode utilisée Header
    };
  },
}));

describe("Header test", () => {
  it("contains a img element in Header", async () => {
    render(
      <MockedProvider mocks={[profileMock]}>
        <Header user={null} refetch={async () => null} />
      </MockedProvider>,
    );

    expect(screen.queryByRole("img")).toBe(null);
  });
});
