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
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Enter room password</label>
      <input
        type="password"
        {...register("password", { min: 4, max: 10, required: true })}
      />
      <button className="p-2 bg-blue-500 rounded shadow-sm">Enter room</button>
    </form>
  );
}
