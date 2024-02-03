"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { WinnerCheckerResults, Player, Slots, Spectator } from "@/shared/types";
import { createFreshSlots, whoWon } from "@/shared/utils";

type GameStatePlayer = {
  name?: string;
  online?: boolean;
};

export type GameState = {
  players: Record<Player, GameStatePlayer>;
  slots: Slots;
  turn: number;
  spectators: Spectator[];
  me: Player | null;
};

type GameContextValues = {
  // State
  state: GameState;
  turnPlayer: Player;
  gameWinner: WinnerCheckerResults | null;
  isGameOver: boolean;

  // Actions
  setState: Dispatch<SetStateAction<GameState>>;
  addPiece: (colNumber: number) => void;
  updateSlot: (coords: [number, number], player: Player) => void;
  goNextTurn: () => void;
  addSpectator: (spectator: Spectator) => void;
  removeSpectator: (spectatorId: string) => void;
  restartGame: () => void;
  joinOpponent: (player: Player, name: string) => void;
  leaveOpponent: () => void;
};

const GameContext = createContext<GameContextValues>({
  state: {
    players: {
      [Player.ONE]: {},
      [Player.TWO]: {},
    },
    slots: [],
    spectators: [],
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
    spectators: [],
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
  const addSpectator = (spectator: Spectator) =>
    setState((prevState) => ({
      ...prevState,
      spectators: [...prevState.spectators, spectator],
    }));
  const removeSpectator = (spectatorId: string) =>
    setState((prevState) => ({
      ...prevState,
      spectators: prevState.spectators.filter(
        (spectator) => spectator.id !== spectatorId
      ),
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
