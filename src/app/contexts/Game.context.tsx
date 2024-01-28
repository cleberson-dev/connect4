"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { Direction, WinnerCheckerResults } from "@/app/types";
import { Player, Slots } from "@/shared/types";

type GameStatePlayer = {
  name?: string;
  online?: boolean;
};

export type GameState = {
  players: Record<Player, GameStatePlayer>;
  slots: Slots;
  turn: number;
  spectators: number;
  me: Player | null;
};

type GameContextValues = {
  // State
  state: GameState;
  turnPlayer: Player;
  gameWinner: WinnerCheckerResults | null;
  isGameOver: boolean;

  // Actions
  setState: (newState: GameState) => void;
  addPiece: (colNumber: number) => void;
  updateSlot: (coords: [number, number], player: Player) => void;
  goNextTurn: () => void;
  addSpectator: () => void;
  removeSpectator: () => void;
  restartGame: () => void;
  joinOpponent: (player: Player, name: string) => void;
  leaveOpponent: () => void;
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
  state: {
    players: {
      [Player.ONE]: {},
      [Player.TWO]: {},
    },
    slots: [],
    spectators: 0,
    turn: 0,
    me: Player.ONE,
  },
  turnPlayer: Player.ONE,
  gameWinner: null,
  isGameOver: false,
  addPiece: () => {},
  addSpectator: () => {},
  removeSpectator: () => {},
  goNextTurn: () => {},
  restartGame: () => {},
  setState: () => {},
  updateSlot: () => {},
  joinOpponent: () => {},
  leaveOpponent: () => {},
});

export const useGame = () => useContext(GameContext);

function GameContextProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<GameState>({
    players: {
      [Player.ONE]: {},
      [Player.TWO]: {},
    },
    slots: createFreshSlots(),
    spectators: 0,
    turn: 0,
    me: Player.ONE,
  });

  // Computed
  const turnPlayer: Player = (state.turn % 2) + 1;
  const gameWinner = useMemo(() => whoWon(state.slots), [state.slots]);
  const isGameOver = useMemo(() => gameWinner !== null, [gameWinner]);

  // Methods/Actions
  const restartGame = () =>
    setState((prevState) => ({
      ...prevState,
      slots: createFreshSlots(),
      turn: 0,
    }));
  const addSpectator = () =>
    setState((prevState) => ({
      ...prevState,
      spectators: prevState.spectators + 1,
    }));
  const removeSpectator = () =>
    setState((prevState) => ({
      ...prevState,
      spectators: prevState.spectators - 1,
    }));
  const goNextTurn = () =>
    setState((prevState) => ({ ...prevState, turn: prevState.turn + 1 }));
  const updateSlot = ([col, row]: [number, number], player: Player) => {
    setState((prevState) => ({
      ...prevState,
      slots: prevState.slots.toSpliced(
        col,
        1,
        prevState.slots[col].toSpliced(row, 1, player)
      ),
    }));
  };

  const addPiece = (colNumber: number) => {
    setState((prevState) => ({
      ...prevState,
      slots: (() => {
        const { slots } = prevState;
        const selectedColumn = [...slots[colNumber]];
        const lastIndexOfNull = selectedColumn.lastIndexOf(null);

        if (lastIndexOfNull === -1) return slots;

        const newColumn = selectedColumn.toSpliced(
          lastIndexOfNull,
          1,
          turnPlayer
        );
        return slots.toSpliced(colNumber, 1, newColumn);
      })(),
    }));
  };

  const joinOpponent = (player: Player, name: string) => {
    setState((prevState) => ({
      ...prevState,
      players: {
        ...prevState.players,
        [player]: {
          name,
          online: true,
        },
      },
    }));
  };

  const leaveOpponent = () => {
    const opponent = state.me === Player.ONE ? Player.TWO : Player.ONE;
    setState((prevState) => ({
      ...prevState,
      players: {
        ...prevState.players,
        [opponent]: {
          ...prevState.players[opponent],
          online: false,
        },
      },
    }));
  };

  return (
    <GameContext.Provider
      value={{
        state,
        turnPlayer,
        gameWinner,
        isGameOver,
        addPiece,
        addSpectator,
        removeSpectator,
        goNextTurn,
        restartGame,
        setState,
        updateSlot,
        joinOpponent,
        leaveOpponent,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export default GameContextProvider;
