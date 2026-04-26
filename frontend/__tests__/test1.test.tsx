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

const user = {
  id: 1,
  first_name: "Den",
  last_name: "PAT",
  avatar: "https://cdn-icons-png.freepik.com/512/6813/6813537.png",
  creation_date: new Date().toISOString(),
  email: "den@den.fr",
  phone: "0650412565",
  role: "parent"
};


jest.mock("next/router", () => ({
  useRouter() {
    return {
      push: () => jest.fn(), // méthode utilisée Header
    };
  },
}));

describe("Header test", () => {
  it("contains user info and logout button", async () => {
    render(
      <MockedProvider mocks={[profileMock]}>
        <Header user={user}
          refetch={async () => null} />
      </MockedProvider>,
    );
    // screen.debug();
    expect(screen.getAllByAltText("Profil de Den")).toHaveLength(2);
    expect(screen.getByTestId("déconnexion")).toHaveTextContent("Déconnexion");
  });
});
