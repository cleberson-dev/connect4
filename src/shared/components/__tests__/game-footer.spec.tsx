import { expect, test } from "vitest";
import GameFooter from "@/shared/components/game-footer";
import { render, screen } from "@testing-library/react";

test("render successfully", () => {
  render(<GameFooter />);
  expect(screen.getByTestId("game-footer")).toBeDefined();
});
