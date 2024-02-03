import { createClient } from "redis";
import short from "short-uuid";
import dotenv from "dotenv";

import { Player, Room } from "@/shared/types";
import { createFreshSlots } from "@/shared/utils";

dotenv.config();

const LIMIT_ROOMS = 50;

const redis = createClient({ password: process.env.REDIS_PASS })
  .on("error", (err: any) => {
    console.error("Redis: Connection Error");
    throw err;
  })
  .connect();

const getRoomKey = (roomId: string) => `room-${roomId}`;

export const createRoom = async (name: string, password: string) => {
  const roomId = short.generate();

  const room: Room = {
    id: roomId,
    name,
    password,
    slots: createFreshSlots(),
    players: {
      [Player.ONE]: {},
      [Player.TWO]: {},
    },
    turn: 0,
    spectators: [],
    creationDate: new Date(),
  };

  await saveRoom(room);

  return room;
};

export const saveRoom = async (room: Room) => {
  const ds = await redis;

  const key = getRoomKey(room.id);

  await (await redis).set(key, JSON.stringify(room));
  await ds.sAdd("rooms", room.id);
};

export const getRoom = async (roomId: string): Promise<Room | null> => {
  const ds = await redis;

  const key = getRoomKey(roomId);
  const value = await ds.get(key);

  return value && JSON.parse(value);
};

export const removeRoom = async (roomId: string) => {
  const ds = await redis;
  await ds.del(roomId);
  await ds.sRem("rooms", roomId);
};

export const getRoomsList = async () => {
  const ds = await redis;
  const roomsIds = (await ds.sMembers("rooms")) as string[];

  const rooms = await Promise.all(
    roomsIds.slice(0, LIMIT_ROOMS).map((roomId) => getRoom(roomId))
  );

  return rooms
    .sort(
      (a, b) =>
        new Date(b!.creationDate).getTime() -
        new Date(a!.creationDate).getTime()
    )
    .map((room) => ({
      id: room!.id,
      name: room!.name,
      players: Object.values(room!.players).filter((player) => player.online)
        .length,
      spectators: room!.spectators.length,
      creationDate: room!.creationDate,
    }));
};
