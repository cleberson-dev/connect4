import { useState } from "react";
import Draggable from "react-draggable";
import cls from "classnames";

import { useComputedGame, useGameStore } from "@/shared/stores/game.store";
import { useDevStore } from "@/shared/stores/dev.store";
import { getPlayerText } from "@/shared/utils";

const GameStateBoxHandle = ({
  collapsed,
  onCollapse,
}: {
  collapsed: boolean;
  onCollapse: () => void;
}) => (
  <strong className="block p-2 bg-slate-500 select-none text-center relative lowercase cursor-move font-normal">
    Game State
    <button
      className="absolute top-0 right-0 px-2 h-full hover:bg-black/5 transition-colors"
      onClick={onCollapse}
    >
      {collapsed ? "+" : "-"}
    </button>
  </strong>
);

export default function DraggableGameStateBox() {
  const [collapsed, setCollapsed] = useState(true);
  const { state, addPiece } = useGameStore();
  const { gameWinner, turnPlayer } = useComputedGame();

  const { toggleShowLabels } = useDevStore();

  const statusText =
    gameWinner === null
      ? "Playing"
      : `Won by ${state.players[gameWinner.player].name}`;

  const turn = state.turn + 1;

  const meText = state.me === null ? "No one" : state.players[state.me].name;
  const [player1, player2] = Object.values(state.players).map(getPlayerText);

  const piecesAdded = state.turn;

  const addPieceInRandomColumn = () =>
    addPiece(Math.floor(Math.random() * state.slots.length), state.me!);

  return (
    <Draggable handle="strong">
      <div
        className="w-40 font-mono text-xs absolute bottom-0"
        data-testid="draggable-game-state-box"
      >
        <GameStateBoxHandle
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />
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
          <div>Status: {statusText}</div>
          <div>Pieces added: {piecesAdded}</div>

          <hr />

          <button onClick={addPieceInRandomColumn}>Add Piece (Random)</button>
          <button onClick={toggleShowLabels}>Show/Hide Label</button>
        </div>
      </div>
    </Draggable>
  );
}
