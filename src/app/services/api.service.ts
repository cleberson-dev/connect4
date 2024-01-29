import axios from "axios";
import { Room } from "@/shared/types";

export type ApiRoom = Omit<
  Room,
  "slots" | "players" | "creationDate" | "password"
> & {
  players: number;
  creationDate: string;
};

type GetRoomsResponse = ApiRoom[];

type CreateRoomResponse = {
  id: string;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HTTP_URL,
});

const routes = {
  getRooms: () => api.get<GetRoomsResponse>("/rooms").then((res) => res.data),
  createRoom: (name: string, password: string) =>
    api.post<CreateRoomResponse>("/rooms", { name, password }),
};

export default routes;
