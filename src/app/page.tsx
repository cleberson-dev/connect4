"use client";

import { useEffect } from "react";
import Board from "./components/board";
import Piece from "./components/piece";
import useGame from "./hooks/useGame";
import cls from "classnames";

export default function Home() {
  const {
    currentPlayer,
    gameSlots,
    gameWinner,
    isGameOver,
    markSlot,
    restartGame,
  } = useGame();

  useEffect(() => {
    let timeout: any;
    if (isGameOver) {
      alert(`Player ${gameWinner!.player} won!`);
      timeout = setTimeout(() => {
        restartGame();
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [isGameOver]);

  return (
    <>
      <div className="flex justify-between items-center gap-x-1 my-4 w-full fixed top-0 px-4 text-lg">
        <div
          className={cls("flex items-center gap-2 relative", {
            "text-violet-500 font-bold": !isGameOver && currentPlayer === "1",
          })}
        >
          <Piece player="1" size="sm" />
          <span>Player 1</span>
          <strong
            className={cls("uppercase absolute -bottom-6 text-sm", {
              hidden: isGameOver || currentPlayer === "2",
            })}
          >
            Your Turn
          </strong>
        </div>
        <button
          onClick={restartGame}
          className="bg-slate-300 rounded shadow-sm hover:shadow text-xs px-3 py-2 font-semibold"
          disabled={isGameOver}
        >
          Restart Game
        </button>
        <div
          className={cls("flex items-center gap-2", {
            "text-violet-500 font-bold": !isGameOver && currentPlayer === "2",
          })}
        >
          <Piece player="2" size="sm" />
          <span>Player 2</span>
          <strong
            className={cls("uppercase absolute -bottom-6 right-4 text-sm", {
              hidden: isGameOver || currentPlayer === "1",
            })}
          >
            Your Turn
          </strong>
        </div>
      </div>
      <main className="flex h-screen flex-col items-center justify-center">
        <Board
          currentPlayer={currentPlayer}
          gameWinner={gameWinner}
          slots={gameSlots}
          isGameOver={isGameOver}
          onColumnClick={markSlot}
        />
      </main>
    </>
  );
}
