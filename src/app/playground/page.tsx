"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

import { useGame } from "@/shared/contexts/Game.context";

import Board from "@/shared/components/board";
import GameHud from "@/shared/components/game-hud";
import DraggableGameStateBox from "@/shared/components/draggable-game-state-box";
import GameFooter from "@/shared/components/game-footer";

import { Player } from "@/shared/types";
import { getNewPlaygroundGame } from "@/shared/utils";

const isProd = process.env.NODE_ENV === "production";
if (isProd) redirect("/");

export default function PlaygroundPage() {
  const game = useGame();

  useEffect(newGame, []);

  function newGame() {
    game.setState(getNewPlaygroundGame());
  }

  const toggleMe = () => {
    game.setState((prevGameState) => ({
      ...prevGameState,
      me: prevGameState.me === Player.ONE ? Player.TWO : Player.ONE,
    }));
  };

  const onColumnClick = (colNumber: number) => {
    game.addPiece(colNumber);
    game.goNextTurn();
    toggleMe();
  };

  return (
    <>
      <GameHud onRestart={newGame} />
      <main className="flex h-[100svh] flex-col items-center justify-center">
        <Board
          playable={!game.isGameOver}
          slots={game.state.slots}
          player={game.state.me!}
          onColumnClick={onColumnClick}
          highlightedSlots={game.gameWinner?.coords}
        />
      </main>
      <GameFooter />

      <DraggableGameStateBox />
    </>
  );
}
