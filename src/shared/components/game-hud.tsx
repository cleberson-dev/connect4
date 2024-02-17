import { useCallback } from "react";

import GameHudPlayerInfo from "@/shared/components/game-hud-player-info";
import { Player } from "@/shared/types";
import { useComputedGame, useGameStore } from "@/shared/stores/game.store";
import Button from "@/shared/components/button";

type GameHudProps = {
  onRestart: () => void;
};

export default function GameHud({ onRestart }: GameHudProps) {
  const {
    state: { players, me },
  } = useGameStore();

  const { turnPlayer, isGameOver, isSpectator } = useComputedGame();

  const isPlayersTurn = useCallback(
    (player: Player) => !isGameOver && player === turnPlayer,
    [isGameOver, turnPlayer]
  );

  return (
    <header
      className="w-full grid grid-cols-[1fr_auto_1fr] gap-x-1 my-4 px-4 fixed top-0 text-sm sm:text-lg select-none last:text-right"
      data-testid="game-hud"
    >
      <GameHudPlayerInfo
        player={Player.ONE}
        isCurrentPlayer={me === Player.ONE}
        isPlayersTurn={isPlayersTurn(Player.ONE)}
        name={players[Player.ONE].name}
        offline={!players[Player.ONE].online}
      />
      <Button size="small" hidden={isSpectator} onClick={onRestart}>
        Restart Game
      </Button>
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
