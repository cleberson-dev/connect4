import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useModal } from "@/shared/contexts/Modal.context";
import Input from "@/shared/components/input";

import { createRoom } from "@/app/actions";
import Button from "../components/button";

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
      <Button color="info" type="submit">
        Create Room
      </Button>
    </form>
  );
}
