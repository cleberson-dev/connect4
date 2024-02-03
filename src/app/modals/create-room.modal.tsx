import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useModal } from "@/app/contexts/Modal.context";
import Input from "@/app/components/input";

import { createRoom } from "@/app/actions";

export default function CreateRoomModal() {
  const [state, formAction] = useFormState(createRoom, null);
  const { hideModal } = useModal();
  const router = useRouter();

  useEffect(() => {
    if (!state?.errors) return;
    Object.values(state?.errors).forEach((error) => toast.error(error));
  }, [state?.errors]);

  useEffect(() => {
    if (!state?.room) return;

    const { id, password } = state.room;
    sessionStorage.setItem("roomPassword", password);
    router.push(`/room/${id}`);

    hideModal();
  }, [state?.room]);

  return (
    <form
      className="bg-white p-8 shadow-sm rounded space-y-2"
      autoComplete="off"
      action={formAction}
    >
      <Input
        placeholder="Your Room Name"
        name="name"
        invalid={!!state?.errors?.name}
      />
      <Input
        type="password"
        name="password"
        placeholder="Enter a password for your room"
        invalid={!!state?.errors?.password}
      />
      <button
        className="w-full p-2 rounded shadow-sm bg-blue-500 text-white disabled:bg-slate-200 disabled:text-black disabled:opacity-50"
        type="submit"
      >
        Create Room
      </button>
    </form>
  );
}
