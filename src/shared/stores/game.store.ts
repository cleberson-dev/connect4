import { create } from "zustand";
import { produce } from "immer";

import { Player, Slots, Spectator, WinnerCheckerResults } from "@/shared/types";
import { createFreshSlots } from "@/shared/utils";
import { whoWon } from "@/shared/utils/game-checker";

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

type State = {
  state: GameState;
  turnPlayer: Player;
  gameWinner: WinnerCheckerResults | null;
  isGameOver: boolean;
  isSpectator: boolean;
  isPlayable: boolean;
};

type Action = {
  setState: (newState: Partial<GameState>) => void;
  addPiece: (colNumber: number) => void;
  updateSlot: (coords: [number, number], player: Player) => void;
  goNextTurn: () => void;
  addSpectator: (spectator: Spectator) => void;
  removeSpectator: (spectatorId: string) => void;
  restartGame: () => void;
  joinOpponent: (player: Player, name: string) => void;
  leaveOpponent: () => void;
};

export const useGameStore = create<State & Action>((set, get) => {
  const state = {
    players: {
      [Player.ONE]: {},
      [Player.TWO]: {},
    },
    slots: [],
    spectators: [],
    turn: 0,
    me: Player.ONE,
  };

  // Computed
  const isEveryPlayerOnline = Object.values(get().state.players).every(
    (player) => player.online
  );

  const isSpectator = get().state.me === null;
  const turnPlayer = (get().state.turn % 2) + 1;
  const gameWinner = whoWon(get().state.slots);
  const isGameOver = gameWinner !== null;
  const isPlayable = !isSpectator && !isGameOver && isEveryPlayerOnline;

  // Methods/Actions
  const restartGame = () =>
    set(
      produce(({ state }: State) => {
        state.slots = createFreshSlots();
        state.turn = 0;
      })
    );

  const addSpectator = (spectator: Spectator) =>
    set(
      produce(({ state }: State) => {
        state.spectators.push(spectator);
      })
    );

  const removeSpectator = (spectatorId: string) =>
    set(
      produce(({ state }: State) => {
        state.spectators = state.spectators.filter(
          (spectator) => spectator.id !== spectatorId
        );
      })
    );

  const goNextTurn = () =>
    set(
      produce(({ state }: State) => {
        state.turn += 1;
      })
    );

  const updateSlot = ([col, row]: [number, number], player: Player) => {
    set(
      produce(({ state }: State) => {
        state.slots[col][row] = player;
      })
    );
  };

  const addPiece = (colNumber: number) => {
    set(
      produce(({ state }: State) => {
        const selectedCol = state.slots[colNumber];
        const lastIndexOfNull = selectedCol.lastIndexOf(null);

        if (lastIndexOfNull === -1) return;

        selectedCol.splice(lastIndexOfNull, 1, turnPlayer);
      })
    );
  };

  const joinOpponent = (player: Player, name: string) => {
    set(
      produce(({ state }: State) => {
        state.players[player].name = name;
        state.players[player].online = true;
      })
    );
  };

  const leaveOpponent = () => {
    set(
      produce(({ state }: State) => {
        const opponent = state.me === Player.ONE ? Player.TWO : Player.ONE;
        state.players[opponent].online = false;
      })
    );
  };

  const setState = (newState: Partial<GameState>) => {
    set(
      produce(({ state: oldState }: State) => {
        oldState = {
          ...oldState,
          ...newState,
        };
      })
    );
  };

  return {
    state,

    // Computed
    turnPlayer,
    gameWinner,
    isGameOver,
    isSpectator,
    isPlayable,

    // Methods
    addPiece,
    addSpectator,
    removeSpectator,
    goNextTurn,
    restartGame,
    updateSlot,
    joinOpponent,
    leaveOpponent,
    setState,
  };
});
