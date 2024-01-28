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
      className="bg-white p-4 shadow-sm rounded"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <label>Name</label>
        <input {...register("name", { min: 4, max: 16, required: true })} />
      </div>
      <div className="flex flex-col">
        <label>Set a password for your room</label>
        <input
          type="password"
          {...register("password", { min: 4, max: 10, required: true })}
        />
      </div>
      <button disabled={!isValid}>Create Room</button>
    </form>
  );
}
