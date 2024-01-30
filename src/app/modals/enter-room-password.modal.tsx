import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import cls from "classnames";

type EnterRoomPasswordModalProps = {
  onConfirm: (name: string, password: string) => void;
};

export default function EnterRoomPasswordModal({
  onConfirm,
}: EnterRoomPasswordModalProps) {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { name: "", password: "" },
  });
  const [hideName, setHideName] = useState(false);
  const [hidePassword, setHidePassword] = useState(false);

  useEffect(() => {
    const name = sessionStorage.getItem("name") ?? "";
    const password = sessionStorage.getItem("roomPassword") ?? "";

    setValue("name", name);
    setHideName(!!name);

    setValue("password", password);
    setHidePassword(!!password);
  }, []);

  const onSubmit: Parameters<typeof handleSubmit>[0] = (values) => {
    const { name, password } = values;
    onConfirm(name, password);
  };

  return (
    <form
      className="flex flex-col gap-y-2 p-8 bg-white rounded shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        className={cls("p-2 rounded border", { hidden: hideName })}
        placeholder="Enter your name"
        {...register("name", { minLength: 4, maxLength: 16, required: true })}
      />
      <input
        type="password"
        className={cls("p-2 rounded border", { hidden: hidePassword })}
        placeholder="Enter room's password"
        {...register("password", {
          minLength: 4,
          maxLength: 10,
          required: true,
        })}
      />
      <button className="p-2 bg-blue-500 text-white rounded shadow-sm">
        Enter room
      </button>
    </form>
  );
}
