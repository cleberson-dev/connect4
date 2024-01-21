"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import cls from "classnames";

import { useGame } from "./contexts/Game.context";

import Board from "./components/board";
import Piece from "./components/piece";

import { Player } from "./types";

const className = {
  header:
    "flex justify-between items-center gap-x-1 my-4 w-full fixed top-0 px-4 text-lg",
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
  const { turnPlayer, isGameOver, restartGame, player } = useGame();

  const isPlayersTurn = useCallback(
    (player: Player) => !isGameOver && player === turnPlayer,
    [isGameOver, turnPlayer]
  );

  const turnText = useMemo(
    () => <strong className={className.turnText}>Turn</strong>,
    []
  );

  return (
    <div className={className.header}>
      <div className={className.playerArea(isPlayersTurn(Player.ONE))}>
        <Piece player={Player.ONE} size="sm" />
        <span>Player 1 {player === Player.ONE && `(YOU)`}</span>
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
        <span>Player 2 {player === Player.TWO && `(YOU)`}</span>
        {isPlayersTurn(Player.TWO) && turnText}
      </div>
    </div>
  );
};

let ws: WebSocket;

export default function Home() {
  const {
    turnPlayer,
    setTurnPlayer,
    player,
    slots,
    setSlots,
    gameWinner,
    isGameOver,
    markSlot,
    restartGame,
    setPlayer,
    updateSlot,
    opponentPlayer,
    changeTurnPlayer,
  } = useGame();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ws = new WebSocket("ws://localhost:8080");
    ws.addEventListener("error", (err: any) => console.error(err));
    ws.addEventListener("message", ({ data }) => {
      const convertedData = JSON.parse(data);
      if (convertedData.type === "JOIN_GAME") {
        setLoading(false);
        setPlayer(convertedData.payload.player);
        setSlots(convertedData.payload.slots);
      }

      if (convertedData.type === "SET_PIECE") {
        updateSlot(convertedData.payload.coords, convertedData.payload.player);
        changeTurnPlayer();
      }

      if (convertedData.type === "RESTART_GAME") {
        restartGame();
      }
    });
    return () => ws.close();
  }, []);

  return (
    <>
      <GameHud />
      <main className={className.main}>
        {!loading && (
          <Board
            isYourTurn={turnPlayer === player}
            turnPlayer={turnPlayer}
            gameWinner={gameWinner}
            slots={slots}
            isGameOver={isGameOver}
            onColumnClick={(colNumber) => {
              ws.send(
                JSON.stringify({ type: "SET_PIECE", payload: { colNumber } })
              );
              markSlot(colNumber);
            }}
          />
        )}
      </main>
    </>
  );
}
