"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

import { useGame } from "@/app/contexts/Game.context";

import Board from "@/app/components/board";
import GameHud from "@/app/components/game-hud";
import DraggableGameStateBox from "@/app/components/draggable-game-state-box";
import GameFooter from "@/app/components/game-footer";

import { Player } from "@/shared/types";
import { createFreshSlots } from "@/server/utils";

const isProd = process.env.NODE_ENV === "production";
if (isProd) redirect("/");

export default function PlaygroundPage() {
  const game = useGame();

  const newGame = () => {
    game.setState({
      me: Player.ONE,
      players: {
        [Player.ONE]: {
          name: "Cleberson",
          online: true,
        },
        [Player.TWO]: {
          name: "Reginaldo",
          online: true,
        },
      },
      slots: createFreshSlots(),
      spectators: [],
      turn: 0,
    });
  };

  useEffect(newGame, []);

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
          player={game.state.me}
          turnPlayer={game.turnPlayer}
          gameWinner={game.gameWinner}
          slots={game.state.slots}
          playable={!game.isGameOver}
          onColumnClick={onColumnClick}
        />
      </main>

      <GameFooter />

      <DraggableGameStateBox />
    </>
  );
}
