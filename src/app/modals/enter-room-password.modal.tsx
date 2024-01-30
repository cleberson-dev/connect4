import { useForm } from "react-hook-form";

type EnterRoomPasswordModalProps = {
  onConfirm: (password: string) => void;
};

export default function EnterRoomPasswordModal({
  onConfirm,
}: EnterRoomPasswordModalProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: { password: "" },
  });

  const onSubmit: Parameters<typeof handleSubmit>[0] = (values) => {
    onConfirm(values.password);
  };

  return (
    <form className="flex flex-col gap-y-2" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="password"
        className="p-2 rounded border"
        placeholder="Enter room's password"
        {...register("password", { min: 4, max: 10, required: true })}
      />
      <button className="p-2 bg-blue-500 text-white rounded shadow-sm">
        Enter room
      </button>
    </form>
  );
}
