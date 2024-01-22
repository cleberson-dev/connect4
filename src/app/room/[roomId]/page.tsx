"use client";

import { useEffect, useState } from "react";
import { LinkIcon, EyeIcon } from "@heroicons/react/16/solid";

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
  const [isSpectator, setIsSpectator] = useState(true);
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
    spectators,
    setSpectators,
  } = useGame();
  useEffect(() => {
    ws = new WebSocket("ws://localhost:8080");
    ws.onclose = () => {
      setSpectators(0);
    };
    ws.onerror = console.error;
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
          setSpectators(action.payload.spectators);
          setIsSpectator(action.payload.isSpectator);
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
        case "SPECTATOR_JOINED": {
          setSpectators((spectators) => spectators + 1);
          break;
        }
        default: {
          console.log("New Event:", action);
        }
      }
    };

    return () => ws.close();
  }, []);

  const shareRoom = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

  if (isLoading) return <Loading />;
  return (
    <>
      <GameHud
        isSpectator={isSpectator}
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
      <footer className="fixed bottom-0 p-2 w-full flex justify-between items-center">
        <div
          className="flex items-center text-xs gap-x-1"
          title={`${spectators} Spectators`}
        >
          <EyeIcon className="w-4 h-4" />
          <span>{spectators}</span>
        </div>
        <p className="absolute w-full text-center">Turn {turn + 1}</p>
        <button
          onClick={shareRoom}
          title="Share Room"
          className="hover:text-blue-500 z-20"
        >
          <LinkIcon className="w-6 h-6" />
        </button>
      </footer>
    </>
  );
}
