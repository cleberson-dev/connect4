"use client";

import { useEffect } from "react";

import { useGame } from "@/app/contexts/Game.context";

import Board from "@/app/components/board";
import GameHud from "@/app/components/game-hud";
import { Player } from "@/shared/types";
import { createFreshSlots } from "@/server/utils";
import { redirect } from "next/navigation";
import DraggableGameStateBox from "../components/draggable-game-state-box";

const isProd = process.env.NODE_ENV === "production";
if (isProd) redirect("/");

export default function PlaygroundPage() {
  const game = useGame();

  useEffect(() => {
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
  }, []);

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
      <GameHud onRestart={game.restartGame} />
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
      <footer className="fixed bottom-0 p-2 w-full flex justify-center items-center">
        <p className="absolute w-full text-center">
          Turn {game.state.turn + 1}
        </p>
      </footer>

      <DraggableGameStateBox />
    </>
  );
}
