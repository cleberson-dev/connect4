import short from "short-uuid";
import { Player, Slots, Spectator } from "@/shared/types";
import { GameState } from "@/shared/stores/game.store";

const [COLS, ROWS] = [7, 6];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const DEFAULT_PLAYGROUND_GAME = {
  me: Player.ONE,
  players: {
    [Player.ONE]: {
      name: "Cleberson",
      online: true,
    },
    [Player.TWO]: {
      name: "Reginaldo",
      online: true,
    },
  },
  slots: [],
  spectators: [],
  turn: 0,
};

export const getLabelBasedOnSlotPosition =
  (rowLength: number) => (col: number, row: number) => {
    const letter = ALPHABET[col];
    const number = rowLength - row;

    return `${letter}${number}`;
  };

export const createSpectator = (name: string): Spectator => ({
  id: short.generate(),
  name,
});

export const createFreshSlots = (cols: number = COLS, rows: number = ROWS) => {
  const slots: Slots = Array.from({ length: cols }, () => {
    return Array.from({ length: rows }, () => null);
  });

  return slots;
};

export const getNewPlaygroundGame = (): GameState => ({
  ...DEFAULT_PLAYGROUND_GAME,
  slots: createFreshSlots(),
});
