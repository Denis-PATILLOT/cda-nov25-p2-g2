import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/pages/index";

// mocks
jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn(), pathname: "/" }),
}));

jest.mock("@/hooks/CurrentProfile", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isStaff: false,
    isParent: false,
    refetch: jest.fn(),
  }),
}));

const loginMock = jest.fn();

jest.mock("@/graphql/generated/schema", () => ({
  useLoginMutation: () => [
    loginMock,
    { loading: false, error: null },
  ],
}));

it("Une connexion avec des valeurs non valides n'appelle pas la mutation login", async() => {
  render(<Home />);

  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Mot de passe")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Se connecter")).toBeInTheDocument();

  // 
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "pasunmail" },
  });

  fireEvent.change(screen.getByPlaceholderText("Mot de passe"), {
    target: { value: "Password123!" },
  });

  expect(screen.getByTitle("Email")).toHaveValue("pasunmail");
  expect(screen.getByTitle("Mot de passe")).toHaveValue("Password123!");
  
  fireEvent.click(screen.getByDisplayValue("Se connecter"));

  // on vérifie que le mock de login n'est pas appelé
  await waitFor(() => expect(loginMock).toHaveBeenCalledTimes(0)); // onSubmit est 'async', donc on doit attendre en appelant waitFor() 
});



it("Une connexion avec des valeurs valides appelle la mutation login", async() => {
  render(<Home />);

  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Mot de passe")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Se connecter")).toBeInTheDocument();

  // 
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "veronique@app.com" },
  });

  fireEvent.change(screen.getByPlaceholderText("Mot de passe"), {
    target: { value: "Password123!" },
  });

  expect(screen.getByTitle("Email")).toHaveValue("veronique@app.com");
  expect(screen.getByTitle("Mot de passe")).toHaveValue("Password123!");
  
  fireEvent.click(screen.getByDisplayValue("Se connecter"));

  // on vérifie que le mock de login est appelé
  await waitFor(() => expect(loginMock).toHaveBeenCalledWith({     // on teste si on a appelé notre mock de login avec les bons éléments saisis !
    variables: {
      data: {
        email: "veronique@app.com",
        password: "Password123!",
      },
    },
  })) // onSubmit est 'async', donc on doit attendre en appelant waitFor() 
});