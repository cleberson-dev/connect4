import { useCallback, useMemo } from "react";
import cls from "classnames";

import Piece from "@/app/components/piece";

import { useGame } from "@/app/contexts/Game.context";
import { Player } from "@/app/types";

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
  isSpectator: boolean;
};

const turnText = <strong className={className.turnText}>Turn</strong>;

export default function GameHud({ onRestart, isSpectator }: GameHudProps) {
  const { turnPlayer, isGameOver, player, opponentPlayer } = useGame();

  const isPlayersTurn = useCallback(
    (player: Player) => !isGameOver && player === turnPlayer,
    [isGameOver, turnPlayer]
  );

  return (
    <header className={className.header}>
      <div
        className={className.playerArea(
          isPlayersTurn(Player.ONE),
          !isSpectator && opponentPlayer === null && player !== Player.ONE
        )}
        title={
          opponentPlayer === null && player !== Player.ONE
            ? "Waiting for opponent"
            : undefined
        }
      >
        <Piece player={Player.ONE} size="sm" />
        <span>Player 1 {!isSpectator && player === Player.ONE && `(YOU)`}</span>
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
          !isSpectator && opponentPlayer === null && player !== Player.TWO
        )} text-right`}
        title={
          opponentPlayer === null && player !== Player.TWO
            ? "Waiting for opponent"
            : undefined
        }
      >
        <Piece player={Player.TWO} size="sm" />
        <span>Player 2 {!isSpectator && player === Player.TWO && `(YOU)`}</span>
        {isPlayersTurn(Player.TWO) && turnText}
      </div>
    </header>
  );
}
