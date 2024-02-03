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

export const flatRoomConnections = (connection: RoomConnection) => {
  const { players, spectators } = connection;
  return [...Object.values(players), ...spectators.values()];
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

export const parseWsMessage = (
  message: RawData
): { type: RequestActionType; payload: any } => {
  return JSON.parse(message.toString());
};
