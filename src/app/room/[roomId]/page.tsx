"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useModal } from "@/shared/contexts/Modal.context";
import { useWebSockets } from "@/shared/hooks/useWebSockets";
import { useLoading } from "@/shared/hooks/useLoading";

import Board from "@/shared/components/board";
import GameHud from "@/shared/components/game-hud";
import GameFooter from "@/shared/components/game-footer";

import LoadingModal from "@/shared/modals/loading.modal";
import EnterRoomPasswordModal from "@/shared/modals/enter-room-password.modal";

import { RequestActionType, ResponseActionType } from "@/shared/types";
import {
  useGameStore,
  GameState,
  useComputedGame,
} from "@/shared/stores/game.store";

type RoomPageProps = {
  params: {
    roomId: string;
  };
};

export default function RoomPage({ params: { roomId } }: RoomPageProps) {
  const [ísEnteringPassword, setIsEnteringPassword] = useState(true);

  const router = useRouter();
  const ws = useWebSockets({});
  const game = useGameStore();
  const { turnPlayer, gameWinner, isPlayable } = useComputedGame();

  const modal = useModal();
  const loading = useLoading();

  const joinRoom = (playerName: string, password: string) => {
    ws.sendMessage(RequestActionType.JOIN_ROOM, {
      roomId,
      password,
      playerName,
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
        toast.error("Room not found. Try again.");
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
        toast.info("Game restarted");
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

  const onRestartGame = () => {
    ws.sendMessage(RequestActionType.RESTART_GAME);
    game.restartGame();
  };

  const onColumnClick = (colNumber: number) => {
    ws.sendMessage(RequestActionType.SET_PIECE, { colNumber });
    game.addPiece(colNumber, turnPlayer);
    game.goNextTurn();
  };

  if (loading.isLoading) return <LoadingModal />;
  if (ísEnteringPassword) return null;

  return (
    <>
      <GameHud onRestart={onRestartGame} />
      <main className="flex h-[100svh] flex-col items-center justify-center">
        <Board
          player={game.state.me!}
          highlightedSlots={gameWinner?.coords}
          slots={game.state.slots}
          playable={isPlayable}
          onColumnClick={onColumnClick}
        />
      </main>
      <GameFooter showSpectators showShareButton />
    </>
  );
}
