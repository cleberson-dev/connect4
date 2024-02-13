import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Board from "@/shared/components/board";
import { Player } from "@/shared/types";

test("render successfully", () => {
  render(<Board slots={[]} player={Player.ONE} />);
  expect(screen.getByTestId("board")).toBeDefined();
});
