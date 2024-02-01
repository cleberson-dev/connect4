import { useCallback } from "react";
import cls from "classnames";

import Piece from "@/app/components/piece";

import { useGame } from "@/app/contexts/Game.context";
import { Player } from "@/shared/types";

const className = {
  header:
    "flex justify-between items-center gap-x-1 my-4 w-full fixed top-0 px-4 text-sm sm:text-lg select-none",
  restartButton: (hidden?: boolean) =>
    cls(
      "bg-slate-300 rounded shadow-sm hover:shadow text-xs px-3 py-2 font-semibold",
      { hidden }
    ),
  playerArea: (isPlayersTurn: boolean = false, isUnavailable: boolean = true) =>
    cls(
      "flex items-center gap-1 sm:gap-2 relative",
      isPlayersTurn && "text-violet-500 font-bold",
      isUnavailable && "opacity-10"
    ),
  turnText:
    "uppercase absolute -bottom-5 sm:-bottom-6 left-0 w-full text-xs sm:text-sm",
};

type GameHudProps = {
  onRestart: () => void;
  isSpectator?: boolean;
};

const turnText = <strong className={className.turnText}>Turn</strong>;

export default function GameHud({ onRestart, isSpectator }: GameHudProps) {
  const { turnPlayer, isGameOver, state } = useGame();

  const isPlayersTurn = useCallback(
    (player: Player) => !isGameOver && player === turnPlayer,
    [isGameOver, turnPlayer]
  );

  return (
    <header className={className.header}>
      <div
        className={className.playerArea(
          isPlayersTurn(Player.ONE),
          !state.players[Player.ONE].online
        )}
        title={!state.players[Player.ONE].online ? "Waiting for opponent" : ""}
      >
        <Piece player={Player.ONE} size="sm" turnPlayer={turnPlayer} />
        <span>
          {state.players[Player.ONE].name || "Player 1"}{" "}
          {!isSpectator && state.me === Player.ONE && `(YOU)`}
        </span>
        {isPlayersTurn(Player.ONE) && turnText}
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <button
          onClick={onRestart}
          className={className.restartButton(isSpectator)}
        >
          Restart Game
        </button>
      </div>
      <div
        className={`${className.playerArea(
          isPlayersTurn(Player.TWO),
          !state.players[Player.TWO].online
        )} text-right`}
        title={!state.players[Player.TWO].online ? "Waiting for opponent" : ""}
      >
        <Piece player={Player.TWO} size="sm" turnPlayer={turnPlayer} />
        <span>
          {state.players[Player.TWO].name || "Player 2"}{" "}
          {!isSpectator && state.me === Player.TWO && `(YOU)`}
        </span>
        {isPlayersTurn(Player.TWO) && turnText}
      </div>
    </header>
  );
}
