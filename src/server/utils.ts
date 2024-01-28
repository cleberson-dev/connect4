import { WebSocket, RawData } from "ws";
import {
  Player,
  RequestActionType,
  ResponseActionType,
  Slots,
} from "@/shared/types";
import { RoomConnection } from "@/server/types";

export const markSlot = (slots: Slots, colNumber: number, player: Player) => {
  const col = slots[colNumber];
  const lastIndexOfNull = col.lastIndexOf(null);
  if (lastIndexOfNull === -1) return;

  col[lastIndexOfNull] = player;

  return { coords: [colNumber, lastIndexOfNull] };
};

export const createFreshSlots = (cols = 7, rows = 6) => {
  const slots: Slots = [];
  for (let i = 0; i < cols; i += 1) {
    slots[i] = [];
    for (let j = 0; j < rows; j += 1) {
      slots[i][j] = null;
    }
  }
  return slots;
};

export const sendMessage = (
  ws: WebSocket,
  type: ResponseActionType,
  payload?: Object
) => {
  ws.send(
    JSON.stringify({
      type,
      payload,
    })
  );
};

export const flatRoomConnections = (connection: RoomConnection) => {
  const { players, spectators } = connection;
  return [...Object.values(players), ...spectators];
};

export const parseWsMessage = (
  message: RawData
): { type: RequestActionType; payload: any } => {
  return JSON.parse(message.toString());
};
