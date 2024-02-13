import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import GameHud from "@/shared/components/game-hud";

test("render successfully", () => {
  render(<GameHud onRestart={() => {}} />);
  expect(screen.getByTestId("game-hud")).toBeDefined();
});
