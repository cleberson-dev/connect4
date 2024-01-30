import { useForm } from "react-hook-form";

type CreateRoomModalProps = {
  onCreate: (name: string, password: string) => void;
};

export default function CreateRoomModal({ onCreate }: CreateRoomModalProps) {
  const {
    register,
    formState: { isValid },
    handleSubmit,
  } = useForm<{ name: string; password: string }>();

  const onSubmit: Parameters<typeof handleSubmit>[0] = (values) => {
    const { name, password } = values;
    onCreate(name, password);
  };

  return (
    <form
      className="bg-white p-8 shadow-sm rounded flex flex-col gap-y-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        className="p-2 rounded border border-solid"
        placeholder="Your Room Name"
        {...register("name", { min: 4, max: 16, required: true })}
      />
      <input
        type="password"
        placeholder="Enter a password for your room"
        className="p-2 rounded border border-solid"
        {...register("password", { min: 4, max: 10, required: true })}
      />
      <button
        className="p-2 rounded shadow-sm bg-blue-500 text-white"
        disabled={!isValid}
      >
        Create Room
      </button>
    </form>
  );
}
