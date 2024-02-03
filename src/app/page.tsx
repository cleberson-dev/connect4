"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";

import { useModal } from "@/app/contexts/Modal.context";

import Input from "@/app/components/input";

import RoomsListModal from "@/app/modals/rooms-list.modal";
import CreateRoomModal from "@/app/modals/create-room.modal";

const schema = yup.object({
  name: yup.string().required().min(4).max(16),
});

export default function Home() {
  const modal = useModal();
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
    modal.showModal(<CreateRoomModal />);
  };

  const openRoomsListModal = () => {
    saveNameInSession();
    modal.showModal(<RoomsListModal />);
  };

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
