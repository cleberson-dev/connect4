import { useState } from "react";
import Draggable from "react-draggable";
import cls from "classnames";

import { Player } from "@/shared/types";
import { useComputedGame, useGameStore } from "@/shared/stores/game.store";

export default function DraggableGameStateBox() {
  const [collapsed, setCollapsed] = useState(true);
  const { state } = useGameStore();
  const { gameWinner, turnPlayer } = useComputedGame();

  const status =
    gameWinner === null
      ? "Playing"
      : `Won by ${state.players[gameWinner.player].name}`;

  const turn = state.turn + 1;

  const meText = state.me === null ? "No one" : state.players[state.me].name;
  const player1 = `${state.players[Player.ONE].name} (${
    state.players[Player.ONE].online ? "Online" : "Offline"
  })`;

  const player2 = `${state.players[Player.TWO].name} (${
    state.players[Player.TWO].online ? "Online" : "Offline"
  })`;

  const piecesAdded = state.turn;

  return (
    <Draggable handle="strong">
      <div
        className="w-40 font-mono text-xs absolute bottom-0"
        data-testid="draggable-game-state-box"
      >
        <strong className="block p-2 bg-slate-500 select-none text-center relative lowercase cursor-move font-normal">
          Game State
          <button
            className="absolute top-0 right-0 px-2 h-full hover:bg-black/5 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "+" : "-"}
          </button>
        </strong>
        <div
          className={cls("p-4 space-y-2 absolute bg-slate-300", {
            hidden: collapsed,
          })}
        >
          <div>Turn: {turn}</div>
          <div>Player 1: {player1}</div>
          <div>Player 2: {player2}</div>
          <div>Me: {meText}</div>
          <div>Turn Player: {state.players[turnPlayer].name}</div>
          <div>Status: {status}</div>
          <div>Pieces added: {piecesAdded}</div>

          <hr />

          <button>Add Piece (Random)</button>
          <button>Show/Hide Label</button>
        </div>
      </div>
    </Draggable>
  );
}
