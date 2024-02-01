import { useState } from "react";
import Draggable from "react-draggable";
import cls from "classnames";
import { useGame } from "../contexts/Game.context";
import { Player } from "@/shared/types";

export default function DraggableGameStateBox() {
  const [collapsed, setCollapsed] = useState(true);
  const game = useGame();
  return (
    <Draggable handle="strong">
      <div className="w-40 font-mono text-xs absolute bottom-0">
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
          <div>Turn: {game.state.turn + 1}</div>
          <div>
            Player 1: {game.state.players[Player.ONE].name} (
            {game.state.players[Player.ONE].online ? "Online" : "Offline"})
          </div>
          <div>
            Player 2: {game.state.players[Player.TWO].name} (
            {game.state.players[Player.TWO].online ? "Online" : "Offline"})
          </div>
          <div>
            Me:{" "}
            {game.state.me === null
              ? "No one"
              : game.state.players[game.state.me].name}
          </div>
          <div>Turn Player: {game.state.players[game.turnPlayer].name}</div>
        </div>
      </div>
    </Draggable>
  );
}
