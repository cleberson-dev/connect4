"use server";

import { z } from "zod";
import { createRoom as dsCreateRoom } from "@/shared/utils/data";

const schemas = {
  createRoom: z.object({
    name: z.string().min(4).max(16),
    password: z.string().min(4).max(10),
  }),
};

export const createRoom = async (_: any, formData: FormData) => {
  const rawFormData = {
    name: formData.get("name") as string,
    password: formData.get("password") as string,
  };

  const validateFields = schemas.createRoom.safeParse(rawFormData);

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }
  const { name, password } = rawFormData;
  const room = await dsCreateRoom(name, password);

  return { room: { id: room.id, password } };
};
