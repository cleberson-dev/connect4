"use client";

import { useEffect, useState } from "react";

import { useGame } from "@/app/contexts/Game.context";

import Board from "@/app/components/board";
import GameHud from "@/app/components/game-hud";
import { MoonLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const Loading = () => (
  <div className="z-50 fixed w-full h-full flex flex-col items-center justify-center">
    <MoonLoader color="blue" />
  </div>
);

let ws: WebSocket;

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const { roomId } = params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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
    setOpponentPlayer,
    changeTurnPlayer,
    opponentPlayer,
    turn,
    setTurn,
  } = useGame();
  useEffect(() => {
    ws = new WebSocket("ws://localhost:8080");
    ws.onclose = console.error;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: { roomId },
        })
      );
    };
    ws.onmessage = ({ data }) => {
      const action = JSON.parse(data);

      switch (action.type) {
        case "JOINED_ROOM": {
          setPlayer(action.payload.player);
          setOpponentPlayer(action.payload.opponentPlayer);
          setSlots(action.payload.slots);
          setTurnPlayer(action.payload.turnPlayer);
          setTurn(action.payload.turn);
          setIsLoading(false);
          break;
        }
        case "ROOM_NOT_FOUND":
        case "ROOM_IS_FULL": {
          router.replace("/");
          break;
        }
        case "SET_PIECE": {
          updateSlot(action.payload.coords, action.payload.player);
          changeTurnPlayer();
          setTurn(action.payload.turn);
          break;
        }
        case "RESTART_GAME": {
          restartGame();
          break;
        }
        case "OPPONENT_JOINED": {
          setOpponentPlayer(action.payload.opponentPlayer);
          break;
        }
        case "OPPONENT_LEFT": {
          setOpponentPlayer(null);
          break;
        }
        default: {
          console.log("New Event:", action);
        }
      }
    };

    return () => ws.close();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <GameHud
        onRestart={() => {
          ws.send(JSON.stringify({ type: "RESTART_GAME" }));
          restartGame();
        }}
      />
      <main className="flex h-[100svh] flex-col items-center justify-center">
        <Board
          isYourTurn={turnPlayer === player}
          turnPlayer={turnPlayer}
          gameWinner={gameWinner}
          slots={slots}
          isGameOver={isGameOver}
          playable={!!(player && opponentPlayer)}
          onColumnClick={(colNumber) => {
            ws?.send(
              JSON.stringify({ type: "SET_PIECE", payload: { colNumber } })
            );
            markSlot(colNumber);
            setTurn(turn + 1);
          }}
        />
      </main>
      <footer className="absolute bottom-0 py-2 w-full text-center">
        <p>Turn {turn + 1}</p>
      </footer>
    </>
  );
}
