"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { Direction, Player, Slots, WinnerCheckerResults } from "../types";

type GameContextValues = {
  slots: Slots;
  currentPlayer: Player;
  gameWinner: WinnerCheckerResults | null;
  isGameOver: boolean;
  markSlot: (colNumber: number) => void;
  restartGame: () => void;
};

const COLS = 7;
const ROWS = 6;

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

type GameCheckerFn = (args: {
  player: Player;
  currentCoord: [number, number];
  count?: number;
  direction?: Direction;
  lastCoords?: [number, number][];
}) => WinnerCheckerResults | null;

const checkGame = (slots: Slots) => {
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

const whoWon = (slots: Slots): WinnerCheckerResults | null => {
  for (let i = 0; i < COLS; i += 1) {
    for (let j = 0; j < ROWS; j += 1) {
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

const GameContext = createContext<GameContextValues>({
  slots: [],
  currentPlayer: Player.ONE,
  gameWinner: null,
  isGameOver: false,
  markSlot: () => {},
  restartGame: () => {},
});

export const useGame = () => useContext(GameContext);

function GameContextProvider({ children }: React.PropsWithChildren) {
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

export default GameContextProvider;
