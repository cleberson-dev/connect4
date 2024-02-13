import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Player } from "@/shared/types";
import Piece from "@/shared/components/piece";

test("<Piece />", () => {
  render(<Piece player={Player.ONE} />);
  expect(screen.getByRole("board-piece")).toBeDefined();
});
