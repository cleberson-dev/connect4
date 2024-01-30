import { useForm } from "react-hook-form";

type CreateRoomModalProps = {
  onCreate: (name: string, password: string) => void;
};

export default function CreateRoomModal({ onCreate }: CreateRoomModalProps) {
  const {
    register,
    formState: { isValid },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      roomName: "",
      roomPassword: "",
    },
  });

  const onSubmit: Parameters<typeof handleSubmit>[0] = (values) => {
    const { roomName, roomPassword } = values;
    onCreate(roomName, roomPassword);
  };

  return (
    <form
      className="bg-white p-8 shadow-sm rounded flex flex-col gap-y-2"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        className="p-2 rounded border border-solid"
        placeholder="Your Room Name"
        {...register("roomName", {
          minLength: 4,
          maxLength: 16,
          required: true,
        })}
      />
      <input
        type="password"
        placeholder="Enter a password for your room"
        className="p-2 rounded border border-solid"
        {...register("roomPassword", {
          minLength: 4,
          maxLength: 10,
          required: true,
        })}
      />
      <button
        className="p-2 rounded shadow-sm bg-blue-500 text-white disabled:bg-slate-200 disabled:text-black disabled:opacity-50"
        type="submit"
        disabled={!isValid}
      >
        Create Room
      </button>
    </form>
  );
}
