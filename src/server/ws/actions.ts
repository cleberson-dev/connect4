import { WebSocket } from "ws";

import {
  createFreshSlots,
  createSpectator,
  flatRoomConnections,
  markSlot,
  sendMessage,
} from "@/server/utils";
import { getRoom, saveRoom } from "@/server/data-source";
import { RoomsConnectionsMap } from "@/server/types";

import { Player, ResponseActionType } from "@/shared/types";

type JoinRoomReturnType =
  | [Player | undefined, Player | undefined, string | undefined]
  | undefined;

export const joinRoom = async (
  ws: WebSocket,
  roomId: string,
  connections: RoomsConnectionsMap,
  password: string,
  playerName: string
): Promise<JoinRoomReturnType> => {
  let me: Player | undefined = undefined;
  let opponent: Player | undefined = undefined;
  let spectatorId: string | undefined = undefined;

  const room = await getRoom(roomId);

  if (!room || room.password !== password) {
    sendMessage(ws, ResponseActionType.ROOM_NOT_FOUND);
    ws.close();
    return;
  }

  let thisRoomConnections = connections.get(roomId);
  if (!thisRoomConnections) {
    thisRoomConnections = {
      spectators: new Map(),
      players: {
        [Player.ONE]: null,
        [Player.TWO]: null,
      },
    };
    connections.set(roomId, thisRoomConnections);
  }

  // Should be a spectator
  if (!!room.players[Player.ONE].online && !!room.players[Player.TWO].online) {
    const spectator = createSpectator(playerName);
    spectatorId = spectator.id;
    room.spectators.push(spectator);
    await saveRoom(room);

    // Send Back Message with Current Game State
    sendMessage(ws, ResponseActionType.JOINED_ROOM, room);

    // Notify spectators entrance to the rest of the room
    flatRoomConnections(connections.get(roomId)!).forEach((connection) => {
      connection &&
        sendMessage(connection, ResponseActionType.SPECTATOR_JOINED, {
          spectator,
        });
    });

    // Add this connection to the room's spectators list
    thisRoomConnections.spectators.set(spectator.id, ws);
    connections.set(roomId, thisRoomConnections);
    return [undefined, undefined, spectatorId];
  }

  // Define which player is this connection
  if (!room.players[Player.ONE].online) {
    room.players[Player.ONE] = {
      name: playerName,
      online: true,
    };
    [me, opponent] = [Player.ONE, Player.TWO];
  } else if (!room.players[Player.TWO].online) {
    room.players[Player.TWO] = {
      name: playerName,
      online: true,
    };
    [me, opponent] = [Player.TWO, Player.ONE];
  }
  await saveRoom(room);

  // Send Back Message with Current Game State
  sendMessage(ws, ResponseActionType.JOINED_ROOM, { ...room, me });

  // Notify the opponent and spectators
  const payload = {
    playerName: room.players[me!].name,
    playerNo: me!,
  };
  const { players, spectators } = thisRoomConnections;
  [players[opponent!], ...spectators.values()].forEach(
    (connection) =>
      connection &&
      sendMessage(connection, ResponseActionType.OPPONENT_JOINED, payload)
  );

  // Save your connection
  thisRoomConnections.players[me!] = ws;
  connections.set(roomId, thisRoomConnections);

  return [me, opponent, undefined];
};

export const setPiece = async (
  ws: WebSocket,
  roomId: string,
  colNumber: number,
  connections: RoomsConnectionsMap,
  me: Player,
  opponent: Player
) => {
  const room = await getRoom(roomId);
  if (!room) return sendMessage(ws, ResponseActionType.ROOM_NOT_FOUND);

  const result = markSlot(room.slots, colNumber, me);
  if (!result) return;
  room.turn += 1;
  await saveRoom(room);

  // Tell the others
  const { players, spectators } = connections.get(room.id)!;
  const payload = { coords: result.coords, player: me };
  [players[opponent], ...spectators.values()].forEach((connection) => {
    connection &&
      sendMessage(connection, ResponseActionType.SET_PIECE, payload);
  });
};

export const restartGame = async (
  ws: WebSocket,
  roomId: string,
  connections: RoomsConnectionsMap
) => {
  const room = await getRoom(roomId);
  if (!room) return sendMessage(ws, ResponseActionType.ROOM_NOT_FOUND);
  room.slots = createFreshSlots();
  room.turn = 0;
  await saveRoom(room);
  flatRoomConnections(connections.get(roomId)!).forEach((connection) => {
    connection && sendMessage(connection, ResponseActionType.RESTART_GAME);
  });
};
