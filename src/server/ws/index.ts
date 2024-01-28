import { WebSocketServer } from "ws";

import { parseWsMessage, sendMessage } from "@/server/utils";
import { getRoom, removeRoom, saveRoom } from "@/server/data-source";
import * as actionHandlers from "@/server/ws/actions";
import { RoomsConnectionsMap, WsConnectionState } from "@/server/types";

import { RequestActionType, ResponseActionType } from "@/shared/types";

const { WS_PORT } = process.env;
const port = WS_PORT ? +WS_PORT : 8080;

const server = new WebSocketServer({ port });
server.on("listening", () => {
  console.log(`WS: Running on port ${port}...`);
});

const connections: RoomsConnectionsMap = new Map();
server.on("connection", (ws) => {
  let connectionState: WsConnectionState = {};

  ws.on("error", console.error);
  ws.on("message", async (data) => {
    const action = parseWsMessage(data);

    switch (action.type) {
      case RequestActionType.JOIN_ROOM: {
        const { roomId, password } = action.payload;

        const result = await actionHandlers.joinRoom(
          ws,
          roomId,
          connections,
          password
        );
        if (!result) break;

        const [me, opponent, spectatorIdx] = result;
        connectionState = { me, opponent, spectatorIdx };

        break;
      }
      case RequestActionType.SET_PIECE: {
        const { roomId, me, opponent } = connectionState;
        const { colNumber } = action.payload;
        await actionHandlers.setPiece(
          ws,
          roomId!,
          colNumber,
          connections,
          me!,
          opponent!
        );
        break;
      }
      case RequestActionType.RESTART_GAME: {
        const { roomId } = connectionState;
        await actionHandlers.restartGame(ws, roomId!, connections);
        break;
      }
      default:
        console.log("New event", action.type);
    }
  });

  ws.on("close", async () => {
    const { roomId, me, opponent, spectatorIdx } = connectionState;

    const room = await getRoom(roomId!);
    if (!room) return;

    const roomConnections = connections.get(room.id);
    if (!roomConnections) return;

    if (
      room.spectators === 0 &&
      Object.values(room.players).filter((player) => player.online).length === 1
    ) {
      console.log("Room empty, removing...");
      await removeRoom(room.id);
      connections.delete(room.id);
      return;
    }

    const { players, spectators } = roomConnections;
    if (!me) {
      console.log("Spectator leaving");
      room.spectators -= 1;
      roomConnections.spectators.splice(spectatorIdx!, 1);
      [...Object.values(players), ...spectators].forEach((connection) => {
        connection &&
          sendMessage(connection, ResponseActionType.SPECTATOR_LEFT);
      });
    }

    if (me) {
      console.log("Player leaving");
      room.players[me].online = false;
      delete roomConnections.players[me];
      [players[opponent!], ...spectators].forEach((connection) => {
        connection && sendMessage(connection, ResponseActionType.OPPONENT_LEFT);
      });
    }

    connections.set(room.id, roomConnections);
    await saveRoom(room);
  });
});