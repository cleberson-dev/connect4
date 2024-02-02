import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import cls from "classnames";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/app/components/input";

const schema = yup.object({
  name: yup.string().required().min(4).max(16),
  password: yup.string().required().min(4).max(10),
});

type EnterRoomPasswordModalProps = {
  onConfirm: (name: string, password: string) => void;
};

export default function EnterRoomPasswordModal({
  onConfirm,
}: EnterRoomPasswordModalProps) {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { name: "", password: "" },
    resolver: yupResolver(schema),
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
      <Input
        className={cls({ hidden: hideName })}
        placeholder="Enter your name"
        {...register("name")}
      />
      <Input
        type="password"
        className={cls({ hidden: hidePassword })}
        placeholder="Enter room's password"
        {...register("password")}
      />
      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded shadow-sm"
      >
        Enter room
      </button>
    </form>
  );
}
