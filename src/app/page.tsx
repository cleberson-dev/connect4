"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/app/services/api.service";
import LoadingModal from "@/app/components/loading-modal";
import RoomsListModal from "@/app/components/rooms-list-modal";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRoomsListModalOpen, setIsRoomsListModalOpen] = useState(false);
  const router = useRouter();

  const createRoom = async () => {
    setIsLoading(true);

    try {
      const {
        data: { id: roomId },
      } = await apiService.createRoom();
      router.push(`/room/${roomId}`);
    } catch (err) {
      console.error("Room, Failed on Creation: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingModal open={isLoading} />
      <main className="flex h-[100svh] flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-black">Connect4</h1>
        <button
          className="p-2 rounded shadow-sm bg-blue-500 text-white text-sm mt-5 hover:bg-blue-600 transition-colors"
          onClick={createRoom}
        >
          Create Room
        </button>
        <button
          className="p-2 rounded shadow-sm bg-orange-500 text-white text-sm mt-5 hover:bg-orange-600 transition-colors"
          onClick={() => setIsRoomsListModalOpen(true)}
        >
          List available rooms
        </button>
      </main>

      {isRoomsListModalOpen && <RoomsListModal />}
    </>
  );
}
