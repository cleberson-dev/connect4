"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

import Board from "@/shared/components/board";
import GameHud from "@/shared/components/game-hud";
import DraggableGameStateBox from "@/shared/components/draggable-game-state-box";
import GameFooter from "@/shared/components/game-footer";

import { Player } from "@/shared/types";
import { getNewPlaygroundGame } from "@/shared/utils";
import { useComputedGame, useGameStore } from "@/shared/stores/game.store";
import { useDevStore } from "@/shared/stores/dev.store";

const isProd = process.env.NODE_ENV === "production";
if (isProd) redirect("/");

export default function PlaygroundPage() {
  const game = useGameStore();
  const { turnPlayer, isGameOver, gameWinner } = useComputedGame();

  const areLabelsShowing = useDevStore((state) => state.areLabelsShowing);

  useEffect(newGame, []);

  function newGame() {
    game.setState(getNewPlaygroundGame());
  }

  const toggleMe = () => {
    game.setState({
      me: game.state.me === Player.ONE ? Player.TWO : Player.ONE,
    });
  };

  const onColumnClick = (colNumber: number) => {
    game.addPiece(colNumber, turnPlayer);
    game.goNextTurn();
    toggleMe();
  };

  return (
    <>
      <GameHud onRestart={newGame} />
      <main className="flex h-[100svh] flex-col items-center justify-center">
        <Board
          playable={!isGameOver}
          slots={game.state.slots}
          player={game.state.me!}
          highlightedSlots={gameWinner?.coords}
          onColumnClick={onColumnClick}
          showLabels={areLabelsShowing}
        />
      </main>
      <GameFooter />

      <DraggableGameStateBox />
    </>
  );
}
