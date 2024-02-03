"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LinkIcon, EyeIcon } from "@heroicons/react/16/solid";
import { Tooltip } from "react-tooltip";

import { useGame, GameState } from "@/shared/contexts/Game.context";
import { useModal } from "@/shared/contexts/Modal.context";
import { useWebSockets } from "@/shared/hooks/useWebSocket";
import { useLoading } from "@/shared/hooks/useLoading";

import Board from "@/shared/components/board";
import GameHud from "@/shared/components/game-hud";

import LoadingModal from "@/shared/modals/loading.modal";
import EnterRoomPasswordModal from "@/shared/modals/enter-room-password.modal";

import { RequestActionType, ResponseActionType } from "@/shared/types";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const { roomId } = params;

  const [ísEnteringPassword, setIsEnteringPassword] = useState(true);

  const router = useRouter();
  const ws = useWebSockets({});
  const game = useGame();

  const modal = useModal();
  const loading = useLoading();

  const joinRoom = (name: string, password: string) => {
    ws.sendMessage(RequestActionType.JOIN_ROOM, {
      roomId,
      password,
      name,
    });
    setIsEnteringPassword(false);
    loading.showLoading();
  };

  useEffect(() => {
    const name = sessionStorage.getItem("name") ?? "";
    const password = sessionStorage.getItem("roomPassword") ?? "";

    if (name && password) return joinRoom(name, password);

    modal.showModal(
      <EnterRoomPasswordModal
        onConfirm={(name, password) => {
          sessionStorage.setItem("name", password);
          sessionStorage.setItem("password", password);
          joinRoom(name, password);
        }}
      />,
      { closable: false }
    );
  }, []);

  useEffect(() => {
    const { action } = ws;

    if (!action) return;
    switch (action.type) {
      case ResponseActionType.JOINED_ROOM: {
        const payload: GameState = action.payload;
        game.setState(payload);
        loading.hideLoading();
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
        game.addSpectator(action.payload.spectator);
        break;
      }
      case ResponseActionType.SPECTATOR_LEFT: {
        game.removeSpectator(action.payload.spectatorId);
        break;
      }
    }
  }, [ws.action]);

  const isSpectator = game.state.me === null;
  const isEveryPlayerOnline = Object.values(game.state.players).every(
    (player) => player.online
  );
  const isGamePlayable =
    !isSpectator && !game.isGameOver && isEveryPlayerOnline;

  const shareRoom = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

  const onRestartGame = () => {
    ws.sendMessage("RESTART_GAME");
    game.restartGame();
  };

  const onColumnClick = (colNumber: number) => {
    ws.sendMessage("SET_PIECE", { colNumber });
    game.addPiece(colNumber);
    game.goNextTurn();
  };

  if (loading.isLoading) return <LoadingModal />;
  if (ísEnteringPassword) return null;

  return (
    <>
      <GameHud isSpectator={isSpectator} onRestart={onRestartGame} />
      <main className="flex h-[100svh] flex-col items-center justify-center">
        <Board
          player={game.state.me}
          turnPlayer={game.turnPlayer}
          gameWinner={game.gameWinner}
          slots={game.state.slots}
          playable={isGamePlayable}
          onColumnClick={onColumnClick}
        />
      </main>
      <footer className="fixed bottom-0 p-2 w-full flex justify-between items-center">
        <div
          id="spectatorsCount"
          className="flex items-center text-xs gap-x-1"
          title={`${game.state.spectators.length} Spectators`}
        >
          <EyeIcon className="w-4 h-4" />
          <span>{game.state.spectators.length}</span>
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

      <Tooltip anchorSelect="#spectatorsCount">
        <ul>
          {game.state.spectators.map((spectator) => (
            <li key={spectator.id}>{spectator.name}</li>
          ))}
        </ul>
      </Tooltip>
    </>
  );
}
