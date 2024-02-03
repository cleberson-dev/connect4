import short from "short-uuid";
import { Player, Slots, Spectator } from "@/shared/types";
import { GameState } from "@/shared/contexts/Game.context";

const [COLS, ROWS] = [7, 6];

const defaultPlaygroundGame = {
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
  (rowLength: number) => (col: number, row: number) =>
    `${["ABCDEFGHIJKLMNOPQRSTUVWXYZ"[col]]}${rowLength - row}`;

export const createSpectator = (name: string): Spectator => {
  return {
    id: short.generate(),
    name,
  };
};

export const createFreshSlots = (cols: number = COLS, rows: number = ROWS) => {
  const slots: Slots = [];
  for (let i = 0; i < cols; i += 1) {
    slots[i] = [];
    for (let j = 0; j < rows; j += 1) {
      slots[i][j] = null;
    }
  }
  return slots;
};

export const getNewPlaygroundGame = (): GameState => ({
  ...defaultPlaygroundGame,
  slots: createFreshSlots(),
});
