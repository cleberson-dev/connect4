import { expect, test } from "vitest";
import GameHudPlayerInfo from "@/shared/components/game-hud-player-info";
import { render, screen } from "@testing-library/react";
import { Player } from "@/shared/types";

test("render successfully", () => {
  render(<GameHudPlayerInfo player={Player.ONE} />);
  expect(screen.getByTestId("game-hud-player-info")).toBeDefined();
});
