import { WebSocket } from "ws";
import { Player } from "@/shared/types";

export type RoomConnection = {
  players: Record<Player, WebSocket | null>;
  spectators: WebSocket[];
};

export type RoomsConnectionsMap = Map<string, RoomConnection>;

export type WsConnectionState = Partial<{
  roomId: string;
  spectatorIdx: number;
  me: Player;
  opponent: Player;
}>;
