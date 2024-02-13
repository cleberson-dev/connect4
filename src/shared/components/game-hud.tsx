import { useCallback } from "react";
import cls from "classnames";

import GameHudPlayerInfo from "@/shared/components/game-hud-player-info";
import { Player } from "@/shared/types";
import { useGameStore } from "@/shared/stores/game.store";

const className = {
  header:
    "w-full grid grid-cols-[1fr_auto_1fr] gap-x-1 my-4 px-4 fixed top-0 text-sm sm:text-lg select-none last:text-right",
  restartButton: (invisible?: boolean) =>
    cls("bg-slate-300 rounded shadow-sm text-xs px-3 py-2 font-semibold", {
      invisible,
    }),
};

type GameHudProps = {
  onRestart: () => void;
};

export default function GameHud({ onRestart }: GameHudProps) {
  const {
    state: { players, me },
    turnPlayer,
    isGameOver,
    isSpectator,
  } = useGameStore();

  const isPlayersTurn = useCallback(
    (player: Player) => !isGameOver && player === turnPlayer,
    [isGameOver, turnPlayer]
  );

  return (
    <header className={className.header} data-testid="game-hud">
      <GameHudPlayerInfo
        player={Player.ONE}
        isCurrentPlayer={me === Player.ONE}
        isPlayersTurn={isPlayersTurn(Player.ONE)}
        name={players[Player.ONE].name}
        offline={!players[Player.ONE].online}
      />
      <button
        onClick={onRestart}
        className={className.restartButton(isSpectator)}
      >
        Restart Game
      </button>
      <GameHudPlayerInfo
        player={Player.TWO}
        isCurrentPlayer={me === Player.TWO}
        isPlayersTurn={isPlayersTurn(Player.TWO)}
        name={players[Player.TWO].name}
        offline={!players[Player.TWO].online}
      />
    </header>
  );
}
