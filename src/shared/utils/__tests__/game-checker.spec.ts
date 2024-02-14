import { expect, test } from "vitest";
import { createFreshSlots } from "@/shared/utils";
import { whoWon } from "@/shared/utils/game-checker";
import { Player } from "@/shared/types";

test("not define game winner for freshly new slots", () => {
  const gameWinner = whoWon(createFreshSlots());
  expect(gameWinner).toBeNull();
});

test("define Player.ONE as game winner", () => {
  const slots = createFreshSlots();
  slots[0][0] = Player.ONE;
  slots[1][0] = Player.ONE;
  slots[2][0] = Player.ONE;
  slots[3][0] = Player.ONE;

  const gameWinner = whoWon(slots);
  expect(gameWinner?.player).toBe(Player.ONE);
});

test("define Player.TWO as game winner", () => {
  const slots = createFreshSlots();
  slots[0][0] = Player.TWO;
  slots[1][0] = Player.TWO;
  slots[2][0] = Player.TWO;
  slots[3][0] = Player.TWO;

  const gameWinner = whoWon(slots);
  expect(gameWinner?.player).toBe(Player.TWO);
});

test("define game winner vertically", () => {
  const slots = createFreshSlots();
  slots[0][0] = Player.ONE;
  slots[1][0] = Player.ONE;
  slots[2][0] = Player.ONE;
  slots[3][0] = Player.ONE;

  const gameWinner = whoWon(slots);
  expect(gameWinner?.player).toBe(Player.ONE);
});

test("define game winner horizontally", () => {
  const slots = createFreshSlots();
  slots[0][0] = Player.ONE;
  slots[0][1] = Player.ONE;
  slots[0][2] = Player.ONE;
  slots[0][3] = Player.ONE;

  const gameWinner = whoWon(slots);
  expect(gameWinner?.player).toBe(Player.ONE);
});

test("define game winner diagonally (left to right)", () => {
  const slots = createFreshSlots();
  slots[0][0] = Player.ONE;
  slots[1][1] = Player.ONE;
  slots[2][2] = Player.ONE;
  slots[3][3] = Player.ONE;

  const gameWinner = whoWon(slots);
  expect(gameWinner?.player).toBe(Player.ONE);
});

test("define game winner diagonally (right to left)", () => {
  const slots = createFreshSlots(7, 6);
  slots[6][0] = Player.ONE;
  slots[5][1] = Player.ONE;
  slots[4][2] = Player.ONE;
  slots[3][3] = Player.ONE;

  const gameWinner = whoWon(slots);
  expect(gameWinner?.player).toBe(Player.ONE);
});
