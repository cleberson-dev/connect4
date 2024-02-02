"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useModal } from "@/app/contexts/Modal.context";

import RoomsListModal from "@/app/modals/rooms-list.modal";
import CreateRoomModal from "@/app/modals/create-room.modal";

import apiService from "@/app/services/api.service";
import useLoading from "@/app/hooks/useLoading";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const modal = useModal();
  const loading = useLoading();
  const {
    register,
    getValues,
    formState: { isValid },
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const name = sessionStorage.getItem("name") ?? "";
    if (!name) return;
    setValue("name", name);
    trigger("name");
  }, []);

  const saveNameInSession = () => {
    const { name } = getValues();
    sessionStorage.setItem("name", name);
  };

  const openCreateRoomModal = () => {
    saveNameInSession();
    modal.showModal(<CreateRoomModal onCreate={createRoom} />);
  };

  const openRoomsListModal = () => {
    saveNameInSession();
    modal.showModal(<RoomsListModal />);
  };

  const createRoom = async (name: string, password: string) => {
    loading.showLoading();

    try {
      const {
        data: { id: roomId },
      } = await apiService.createRoom(name, password);
      sessionStorage.setItem("roomPassword", password);
      router.push(`/room/${roomId}`);
    } catch (err) {
      console.error("Room, Failed on Creation: ", err);
    } finally {
      loading.hideLoading();
    }
  };

  if (loading.isLoading) return null;

  return (
    <main className="flex h-[100svh] flex-col items-center justify-center text-center space-y-4 text-sm">
      <h1 className="text-5xl font-black">Connect4</h1>
      <input
        className="p-2 bg-gray-100 rounded-md border-0"
        placeholder="Your name"
        {...register("name", { minLength: 4, maxLength: 16, required: true })}
      />
      <button
        className="p-2 rounded shadow-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        onClick={openCreateRoomModal}
        disabled={!isValid}
      >
        Create Room
      </button>
      <button
        className="p-2 rounded shadow-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors"
        onClick={openRoomsListModal}
        disabled={!isValid}
      >
        Join Room
      </button>
    </main>
  );
}
