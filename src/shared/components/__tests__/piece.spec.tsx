import { expect, test, describe } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Player } from "@/shared/types";
import Piece from "@/shared/components/piece";

describe("<Piece />", () => {
  test("should render successfully", () => {
    cleanup();
    render(<Piece player={Player.ONE} />);
    expect(screen.getByRole("board-piece")).toBeDefined();
  });

  test("should render different elements for empty and non-empty pieces", () => {
    cleanup();
    render(
      <>
        <Piece player={Player.ONE} />
        <Piece player={null} />
      </>
    );

    const [a, b] = screen.getAllByRole("board-piece");

    expect(a.nodeName).not.toBe(b.nodeName);
  });

  test("should render same elements for players one and two", () => {
    cleanup();
    render(
      <>
        <Piece player={Player.ONE} />
        <Piece player={Player.TWO} />
      </>
    );

    const [a, b] = screen.getAllByRole("board-piece");

    expect(a.nodeName).toBe(b.nodeName);
  });
});
