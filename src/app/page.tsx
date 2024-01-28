"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/contexts/Modal.context";

import LoadingModal from "@/app/modals/loading.modal";
import RoomsListModal from "@/app/modals/rooms-list.modal";
import CreateRoomModal from "@/app/modals/create-room.modal";

import apiService from "@/app/services/api.service";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const modal = useModal();

  const openCreateRoomModal = () => {
    modal.showModal(<CreateRoomModal onCreate={createRoom} />);
  };

  const createRoom = async (name: string, password: string) => {
    setIsLoading(true);
    modal.showModal(<LoadingModal />);

    try {
      const {
        data: { id: roomId },
      } = await apiService.createRoom(name, password);
      router.push(`/room/${roomId}`);
    } catch (err) {
      console.error("Room, Failed on Creation: ", err);
    } finally {
      setIsLoading(false);
      modal.hideModal();
    }
  };

  const openRoomsListModal = () => {
    modal.showModal(<RoomsListModal />);
  };

  if (isLoading) return null;

  return (
    <main className="flex h-[100svh] flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-black">Connect4</h1>
      <button
        className="p-2 rounded shadow-sm bg-blue-500 text-white text-sm mt-5 hover:bg-blue-600 transition-colors"
        onClick={openCreateRoomModal}
      >
        Create Room
      </button>
      <button
        className="p-2 rounded shadow-sm bg-orange-500 text-white text-sm mt-5 hover:bg-orange-600 transition-colors"
        onClick={openRoomsListModal}
      >
        List available rooms
      </button>
    </main>
  );
}
