import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import DraggableGameStateBox from "../draggable-game-state-box";

test("render succesfully", () => {
  render(<DraggableGameStateBox />);
  expect(screen.getByTestId("draggable-game-state-box")).toBeDefined();
});
