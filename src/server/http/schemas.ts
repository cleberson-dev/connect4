import Joi from "joi";

export const createRoomSchema = Joi.object({
  name: Joi.string().min(4).max(16).required(),
  password: Joi.string().min(4).max(10).required(),
});
