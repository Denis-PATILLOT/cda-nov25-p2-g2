import { render, screen } from "@testing-library/react";
import ChildCard from "../src/components/parent/ChildCard";

describe("ChildCard", () => {
  const childMock = {
    id: 1,
    firstName: "Ichem",
    lastName: "Battour",
    birthDate: "2025-02-16",
    picture:
      "https://img.freepik.com/photos-gratuite/bebe-sourit-joyeusement_1150-24911.jpg?semt=ais_hybrid&w=740&q=80",
    group: {
      id: "1",
      name: "Groupe des petits",
    },
  };

  it("affiche le nom de l'enfant", () => {
    render(<ChildCard child={childMock} />);

    expect(screen.getByText("Ichem Battour")).toBeInTheDocument();
  });
});
