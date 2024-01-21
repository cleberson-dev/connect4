"use client";

import { useCallback, useEffect, useMemo } from "react";
import Board from "./components/board";
import Piece from "./components/piece";
import { Player, useGame } from "./contexts/Game.context";
import cls from "classnames";

const className = {
  header:
    "flex justify-between items-center gap-x-1 my-4 w-full fixed top-0 px-4 text-lg relative",
  restartButton:
    "bg-slate-300 rounded shadow-sm hover:shadow text-xs px-3 py-2 font-semibold",
  main: "flex h-screen flex-col items-center justify-center",
  playerArea: (isPlayersTurn: boolean = false) =>
    cls(
      "flex items-center gap-2 relative",
      isPlayersTurn && "text-violet-500 font-bold"
    ),
  turnText: "uppercase absolute -bottom-6 left-0 w-full text-sm",
};

const GameHud = () => {
  const { currentPlayer, isGameOver, restartGame } = useGame();

  const isPlayersTurn = useCallback(
    (player: Player) => !isGameOver && player === currentPlayer,
    [isGameOver, currentPlayer]
  );

  const turnText = useMemo(
    () => <strong className={className.turnText}>Your Turn</strong>,
    []
  );
  return (
    <div className={className.header}>
      <div className={className.playerArea(isPlayersTurn(Player.ONE))}>
        <Piece player="1" size="sm" />
        <span>Player 1</span>
        {isPlayersTurn(Player.ONE) && turnText}
      </div>
      <div className="absolute w-full h-full flex items-center justify-center">
        <button
          onClick={restartGame}
          className={className.restartButton}
          disabled={isGameOver}
        >
          Restart Game
        </button>
      </div>
      <div
        className={`${className.playerArea(
          isPlayersTurn(Player.TWO)
        )} text-right`}
      >
        <Piece player={Player.TWO} size="sm" />
        <span>Player 2</span>
        {isPlayersTurn(Player.TWO) && turnText}
      </div>
    </div>
  );
};

export default function Home() {
  const {
    currentPlayer,
    slots,
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
  }, [isGameOver, gameWinner, restartGame]);

  return (
    <>
      <GameHud />
      <main className={className.main}>
        <Board
          currentPlayer={currentPlayer}
          gameWinner={gameWinner}
          slots={slots}
          isGameOver={isGameOver}
          onColumnClick={markSlot}
        />
      </main>
    </>
  );
}
