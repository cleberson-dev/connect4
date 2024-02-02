import { useForm } from "react-hook-form";
import Input from "@/app/components/input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type CreateRoomModalProps = {
  onCreate: (name: string, password: string) => void;
};

const schema = yup.object({
  roomName: yup.string().required().min(4).max(16),
  roomPassword: yup.string().required().min(4).max(10),
});

export default function CreateRoomModal({ onCreate }: CreateRoomModalProps) {
  const {
    register,
    formState: { isValid },
    handleSubmit,
  } = useForm({
    defaultValues: {
      roomName: "",
      roomPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit: Parameters<typeof handleSubmit>[0] = ({
    roomName,
    roomPassword,
  }) => {
    onCreate(roomName, roomPassword);
  };

  return (
    <form
      className="bg-white p-8 shadow-sm rounded space-y-2"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input placeholder="Your Room Name" {...register("roomName")} />
      <Input
        type="password"
        placeholder="Enter a password for your room"
        {...register("roomPassword")}
      />
      <button
        className="w-full p-2 rounded shadow-sm bg-blue-500 text-white disabled:bg-slate-200 disabled:text-black disabled:opacity-50"
        type="submit"
        disabled={!isValid}
      >
        Create Room
      </button>
    </form>
  );
}
