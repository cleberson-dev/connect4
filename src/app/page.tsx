"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";

import { useModal } from "@/app/contexts/Modal.context";
import { useLoading } from "@/app/hooks/useLoading";

import Input from "@/app/components/input";

import RoomsListModal from "@/app/modals/rooms-list.modal";
import CreateRoomModal from "@/app/modals/create-room.modal";

import apiService from "@/app/services/api.service";

const schema = yup.object({
  name: yup.string().required().min(4).max(16),
});

export default function Home() {
  const router = useRouter();
  const modal = useModal();
  const loading = useLoading();
  const {
    register,
    getValues,
    formState: { errors },
    setValue,
    trigger,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  }, [errors]);

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
    <main className="flex h-[100svh] flex-col items-center justify-center text-center space-y-4 text-sm text-white">
      <h1 className="text-5xl font-black text-black">Connect4</h1>
      <Input
        placeholder="Your name"
        invalid={!!errors.name}
        {...register("name")}
      />
      <button
        className="p-2 rounded shadow-sm bg-blue-500 hover:bg-blue-600 transition-colors"
        onClick={handleSubmit(openCreateRoomModal)}
      >
        Create Room
      </button>
      <button
        className="p-2 rounded shadow-sm bg-orange-500 hover:bg-orange-600 transition-colors"
        onClick={handleSubmit(openRoomsListModal)}
      >
        Join Room
      </button>
    </main>
  );
}
