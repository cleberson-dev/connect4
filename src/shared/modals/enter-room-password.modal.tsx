import { useEffect, useState } from "react";
import cls from "classnames";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Input from "@/shared/components/input";
import Button from "@/shared/components/button";

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
      <Button type="submit" color="info">
        Enter room
      </Button>
    </form>
  );
}
