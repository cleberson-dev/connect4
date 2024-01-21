"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useState } from "react";

const COLS = 7;
const ROWS = 6;

type GameContextValues = {
  slots: Slots;
  currentPlayer: Player;
  gameWinner: WinnerCheckerResults | null;
  isGameOver: boolean;
  markSlot: (colNumber: number) => void;
  restartGame: () => void;
};

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  UP_LEFT,
  UP_RIGHT,
  DOWN_LEFT,
  DOWN_RIGHT,
}

export enum Player {
  ONE = 1,
  TWO = 2,
}

export type Slots = (Player | null)[][];

export type WinnerCheckerResults = {
  player: Player.ONE | Player.TWO;
  coords: [number, number][];
};

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

const getAllDirections = ([i, j]: [number, number]) => {
  return {
    [Direction.LEFT]: [i - 1, j],
    [Direction.RIGHT]: [i + 1, j],
    [Direction.UP]: [i, j - 1],
    [Direction.DOWN]: [i, j + 1],
    [Direction.UP_LEFT]: [i - 1, j - 1],
    [Direction.UP_RIGHT]: [i + 1, j - 1],
    [Direction.DOWN_LEFT]: [i - 1, j + 1],
    [Direction.DOWN_RIGHT]: [i + 1, j + 1],
  } as const;
};

const checkGame = (slots: Slots) => {
  const gameChecker = (
    player: Player,
    [i, j]: [number, number],
    count = 1,
    direction?: Direction,
    coords: [number, number][] = []
  ): WinnerCheckerResults | null => {
    if (player !== slots[i]?.[j]) return null;
    if (count === 4) return { player, coords };

    const directions = getAllDirections([i, j]);

    if (count === 1) {
      return Object.entries(directions).reduce<WinnerCheckerResults>(
        (winner, [directionName, [col, row]]) =>
          winner ??
          gameChecker(
            player,
            [col, row],
            count + 1,
            directionName as unknown as Direction,
            [...coords, [col, row]]
          ),
        null
      );
    }

    const [col, row] = directions[direction!];
    return gameChecker(player, [col, row], count + 1, direction!, [
      ...coords,
      [col, row],
    ]);
  };

  return gameChecker;
};

const whoWon = (slots: Slots): WinnerCheckerResults | null => {
  for (let i = 0; i < COLS; i += 1) {
    for (let j = 0; j < ROWS; j += 1) {
      const player = slots[i][j];
      if (player === null) continue;
      const checkGameWithSlots = checkGame(slots);

      const winner = checkGameWithSlots(player, [i, j], 1, undefined, [[i, j]]);
      if (winner !== null) return winner;
    }
  }
  return null;
};

const GameContext = createContext<GameContextValues>({
  slots: [],
  currentPlayer: Player.ONE,
  gameWinner: null,
  isGameOver: false,
  markSlot: () => {},
  restartGame: () => {},
});

export const useGame = () => useContext(GameContext);

export default function GameContextProvider({
  children,
}: React.PropsWithChildren) {
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.ONE);
  const [slots, setSlots] = useState(createFreshSlots());

  const restartGame = useCallback(() => {
    setSlots(createFreshSlots());
    setCurrentPlayer(Player.ONE);
  }, []);

  const changePlayer = useCallback(
    () =>
      setCurrentPlayer((previousPlayer) =>
        previousPlayer === Player.ONE ? Player.TWO : Player.ONE
      ),
    []
  );

  const markSlot = useCallback(
    (colNumber: number) => {
      setSlots((prevSlots) => {
        const selectedColumn = [...prevSlots[colNumber]];
        const lastIndexOfNull = selectedColumn.lastIndexOf(null);

        if (lastIndexOfNull === -1) return prevSlots;

        const newColumn = selectedColumn.toSpliced(
          lastIndexOfNull,
          1,
          currentPlayer
        );
        return prevSlots.toSpliced(colNumber, 1, newColumn);
      });
      changePlayer();
    },
    [currentPlayer, changePlayer]
  );

  const gameWinner = useMemo(() => whoWon(slots), [slots]);
  const isGameOver = useMemo(() => gameWinner !== null, [gameWinner]);

  return (
    <GameContext.Provider
      value={{
        slots,
        currentPlayer,
        gameWinner,
        isGameOver,
        markSlot,
        restartGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
