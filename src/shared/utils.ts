import short from "short-uuid";
import {
  Direction,
  GameCheckerFn,
  Player,
  Slots,
  Spectator,
  WinnerCheckerResults,
} from "@/shared/types";
import { GameState } from "./contexts/Game.context";

const [COLS, ROWS] = [7, 6];

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

const getAllDirections = ([i, j]: [number, number]) => {
  return {
    [Direction.UP]: [i, j - 1],
    [Direction.DOWN]: [i, j + 1],
    [Direction.LEFT]: [i - 1, j],
    [Direction.RIGHT]: [i + 1, j],
    [Direction.UP_LEFT]: [i - 1, j - 1],
    [Direction.UP_RIGHT]: [i + 1, j - 1],
    [Direction.DOWN_LEFT]: [i - 1, j + 1],
    [Direction.DOWN_RIGHT]: [i + 1, j + 1],
  } as const;
};

export const checkGame = (slots: Slots) => {
  const gameChecker: GameCheckerFn = ({
    player,
    currentCoord: [i, j],
    count = 1,
    direction,
    lastCoords = [],
  }): WinnerCheckerResults | null => {
    const isPlayersPiece = player === slots[i]?.[j];
    if (!isPlayersPiece) return null;
    if (count === 4) return { player, coords: lastCoords };

    const directions = getAllDirections([i, j]);

    if (count === 1) {
      return Object.entries(directions).reduce<WinnerCheckerResults | null>(
        (winner, [directionName, [col, row]]) =>
          winner ??
          gameChecker({
            player,
            currentCoord: [col, row],
            count: count + 1,
            direction: directionName as unknown as Direction,
            lastCoords: [...lastCoords, [col, row]],
          }),
        null
      );
    }

    const [col, row] = directions[direction!];
    return gameChecker({
      player,
      currentCoord: [col, row],
      count: count + 1,
      direction: direction!,
      lastCoords: [...lastCoords, [col, row]],
    });
  };

  return gameChecker;
};

export const whoWon = (slots: Slots): WinnerCheckerResults | null => {
  const [cols, rows] = [slots.length, slots[0].length];
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      const player = slots[i][j];
      if (player === null) continue;
      const checkGameWithSlots = checkGame(slots);

      const winner = checkGameWithSlots({
        player,
        currentCoord: [i, j],
        count: 1,
        direction: undefined,
        lastCoords: [[i, j]],
      });
      if (winner !== null) return winner;
    }
  }
  return null;
};

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

export const getNewPlaygroundGame = (): GameState => ({
  ...defaultPlaygroundGame,
  slots: createFreshSlots(),
});
