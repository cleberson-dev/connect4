"use client";

import { useEffect, useState } from "react";
import { LinkIcon, EyeIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

import { GameState, useGame } from "@/app/contexts/Game.context";

import Board from "@/app/components/board";
import GameHud from "@/app/components/game-hud";
import LoadingModal from "@/app/components/loading-modal";
import { useWebSockets } from "@/app/hooks/useWebSocket";
import { ResponseActionType } from "@/shared/types";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const { roomId } = params;

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const game = useGame();
  const ws = useWebSockets({
    onOpen: () => {
      ws.sendMessage("JOIN_ROOM", { roomId });
    },
  });

  useEffect(() => {
    const { action } = ws;

    if (!action) return;
    switch (action.type) {
      case ResponseActionType.JOINED_ROOM: {
        const payload: GameState = action.payload;
        game.setState(payload);
        setIsLoading(false);
        break;
      }
      case ResponseActionType.ROOM_NOT_FOUND: {
        alert("Room not found");
        router.replace("/");
        break;
      }
      case ResponseActionType.SET_PIECE: {
        game.updateSlot(action.payload.coords, action.payload.player);
        game.goNextTurn();
        break;
      }
      case ResponseActionType.RESTART_GAME: {
        game.restartGame();
        break;
      }
      case ResponseActionType.OPPONENT_JOINED: {
        const { playerNo, playerName } = action.payload;
        game.joinOpponent(playerNo, playerName);
        break;
      }
      case ResponseActionType.OPPONENT_LEFT: {
        game.leaveOpponent();
        break;
      }
      case ResponseActionType.SPECTATOR_JOINED: {
        game.addSpectator();
        break;
      }
      case ResponseActionType.SPECTATOR_LEFT: {
        game.removeSpectator();
        break;
      }
    }
  }, [ws.action]);

  const isSpectator = game.state.me === null;
  const isEveryPlayerOnline = Object.values(game.state.players).every(
    (player) => player.online
  );
  const shareRoom = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

  if (isLoading) return <LoadingModal open />;

  return (
    <>
      <GameHud
        isSpectator={isSpectator}
        onRestart={() => {
          ws.sendMessage("RESTART_GAME");
          game.restartGame();
        }}
      />
      <main className="flex h-[100svh] flex-col items-center justify-center">
        <Board
          player={game.state.me}
          turnPlayer={game.turnPlayer}
          gameWinner={game.gameWinner}
          slots={game.state.slots}
          playable={!isSpectator && !game.isGameOver && isEveryPlayerOnline}
          onColumnClick={(colNumber) => {
            ws.sendMessage("SET_PIECE", { colNumber });
            game.addPiece(colNumber);
            game.goNextTurn();
          }}
        />
      </main>
      <footer className="fixed bottom-0 p-2 w-full flex justify-between items-center">
        <div
          className="flex items-center text-xs gap-x-1"
          title={`${game.state.spectators} Spectators`}
        >
          <EyeIcon className="w-4 h-4" />
          <span>{game.state.spectators}</span>
        </div>
        <p className="absolute w-full text-center">
          Turn {game.state.turn + 1}
        </p>
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
