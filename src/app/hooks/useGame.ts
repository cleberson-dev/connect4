import { useState } from "react";

const COLS = 7;
const ROWS = 6;

export type Direction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "upLeft"
  | "upRight"
  | "downLeft"
  | "downRight";

export type Player = "1" | "2" | null;

export type Slots = Player[][];

export type WinnerCheckerResults = {
  player: "1" | "2";
  coords: [number, number][];
} | null;

const createFreshSlots = (cols = COLS, rows = ROWS) => {
  const slots: Slots = [];
  for (let i = 0; i < cols; i += 1) {
    slots[i] = [];
    for (let j = 0; j < rows; j += 1) {
      slots[i][j] = null;
    }
  }
  return slots;
};

const whoWon = (slots: Slots): WinnerCheckerResults => {
  for (let i = 0; i < COLS; i += 1) {
    for (let j = 0; j < ROWS; j += 1) {
      const player = slots[i][j];
      if (player === null) continue;

      const winMatcher = (
        player: "1" | "2",
        i: number,
        j: number,
        count = 1,
        direction?: Direction,
        coords: [number, number][] = []
      ): WinnerCheckerResults => {
        if (player !== slots[i]?.[j]) return null;
        if (count === 4)
          return {
            player,
            coords,
          };

        const newCount = count + 1;

        const directions = {
          left: [i - 1, j],
          right: [i + 1, j],
          up: [i, j - 1],
          down: [i, j + 1],
          upLeft: [i - 1, j - 1],
          upRight: [i + 1, j - 1],
          downLeft: [i - 1, j + 1],
          downRight: [i + 1, j + 1],
        } as const;

        if (count === 1) {
          return Object.entries(directions).reduce<WinnerCheckerResults>(
            (winner, [directionName, direction]) =>
              winner ??
              winMatcher(
                player,
                direction[0],
                direction[1],
                newCount,
                directionName as Direction,
                [...coords, [direction[0], direction[1]]]
              ),
            null
          );
        }

        const directionIndices = directions[direction!];

        return winMatcher(
          player,
          directionIndices[0],
          directionIndices[1],
          newCount,
          direction!,
          [...coords, [directionIndices[0], directionIndices[1]]]
        );
      };

      const winner = winMatcher(player, i, j, 1, undefined, [[i, j]]);
      if (winner !== null) return winner;
    }
  }
  return null;
};

export default function useGame() {
  const [currentPlayer, setCurrentPlayer] = useState<"1" | "2">("1");
  const [gameSlots, setGameSlots] = useState(createFreshSlots());

  const restartGame = () => {
    setGameSlots(createFreshSlots());
    setCurrentPlayer("1");
  };

  const changePlayer = () =>
    setCurrentPlayer((previousPlayer) => (previousPlayer === "1" ? "2" : "1"));

  const markSlot = (colNumber: number) => {
    setGameSlots((prevGameSlots) => {
      const selectedColumn = [...prevGameSlots[colNumber]];
      const lastIndexOfNull = selectedColumn.lastIndexOf(null);

      if (lastIndexOfNull === -1) return prevGameSlots;

      const newColumn = selectedColumn.toSpliced(
        lastIndexOfNull,
        1,
        currentPlayer
      );
      return prevGameSlots.toSpliced(colNumber, 1, newColumn);
    });
    changePlayer();
  };

  const gameWinner = whoWon(gameSlots);
  const isGameOver = gameWinner !== null;

  return {
    gameSlots,
    currentPlayer,
    isGameOver,
    gameWinner,
    markSlot,
    restartGame,
  };
}
