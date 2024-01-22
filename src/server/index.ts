import { WebSocketServer, WebSocket } from "ws";
import { Player, Slots } from "./types";
import short from "short-uuid";

const { WS_PORT: PORT } = process.env;

const rooms = new Map<string, GameState>();

const markSlot = (slots: Slots, colNumber: number, player: Player) => {
  const col = slots[colNumber];
  const lastIndexOfNull = col.lastIndexOf(null);
  if (lastIndexOfNull === -1) return;

  col[lastIndexOfNull] = player;

  return { coords: [colNumber, lastIndexOfNull] };
};

const createFreshSlots = (cols = 7, rows = 6) => {
  const slots: Slots = [];
  for (let i = 0; i < cols; i += 1) {
    slots[i] = [];
    for (let j = 0; j < rows; j += 1) {
      slots[i][j] = null;
    }
  }
  return slots;
};

type GameState = {
  slots: Slots;
  players: {
    [Player.ONE]?: WebSocket;
    [Player.TWO]?: WebSocket;
  };
  turn: number;
  spectators: WebSocket[];
};

enum ActionType {
  ROOM_IS_FULL = "ROOM_IS_FULL",
  SET_PIECE = "SET_PIECE",
  RESTART_GAME = "RESTART_GAME",
  OPPONENT_LEFT = "OPPONENT_LEFT",
  OPPONENT_JOINED = "OPPONENT_JOINED",
  CREATE_ROOM = "CREATE_ROOM",
  ROOM_CREATED = "ROOM_CREATED",
  JOIN_ROOM = "JOIN_ROOM",
  JOINED_ROOM = "JOINED_ROOM",
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  SPECTATOR_JOINED = "SPECTATOR_JOINED",
}

const server = new WebSocketServer({
  port: PORT ? +PORT : 8080,
});

server.on("listening", () => {
  console.log("WS Socket Server up and running...");
});

server.on("connection", (ws) => {
  let room: GameState | undefined;
  let player: Player;
  let spectatorIdx: number;

  ws.on("error", console.error);
  ws.on("message", (data) => {
    const peers = [];
    const opponentPlayerConnection = player
      ? room?.players[player === Player.ONE ? Player.TWO : Player.ONE]
      : undefined;
    if (opponentPlayerConnection) {
      peers.push(opponentPlayerConnection);
    }
    peers.push(...(room?.spectators || []));

    const action = JSON.parse(`${data}`);
    console.log(action);
    switch (action.type) {
      case ActionType.SET_PIECE: {
        if (!room) return sendMessage(ActionType.ROOM_NOT_FOUND);

        const result = markSlot(room.slots, action.payload.colNumber, player);
        if (!result) return;

        room.turn += 1;
        peers.forEach((peer) => {
          peer.send(
            JSON.stringify({
              type: ActionType.SET_PIECE,
              payload: { coords: result.coords, player, turn: room!.turn },
            })
          );
        });
        break;
      }
      case ActionType.RESTART_GAME: {
        if (!room) return sendMessage(ActionType.ROOM_NOT_FOUND);
        room.slots = createFreshSlots();
        room.turn = 0;
        peers.forEach((peer) => {
          peer.send(
            JSON.stringify({
              type: ActionType.RESTART_GAME,
            })
          );
        });
        break;
      }
      case ActionType.CREATE_ROOM: {
        const roomId = short.generate();
        rooms.set(roomId, {
          slots: createFreshSlots(),
          players: {},
          turn: 0,
          spectators: [],
        });
        sendMessage(ActionType.ROOM_CREATED, { roomId });
        break;
      }
      case ActionType.JOIN_ROOM: {
        const { roomId } = action.payload;
        room = rooms.get(roomId);
        if (!room) {
          sendMessage(ActionType.ROOM_NOT_FOUND);
          break;
        }
        const isSpectator =
          room.players[Player.ONE] && room.players[Player.TWO];
        if (isSpectator) {
          sendMessage(ActionType.JOINED_ROOM, {
            player: null,
            opponentPlayer: null,
            slots: room.slots,
            turnPlayer: (room.turn % 2) + 1,
            turn: room.turn,
            spectators: room.spectators.length + 1,
            isSpectator: true,
          });
          [
            room.players[Player.ONE],
            room.players[Player.TWO],
            ...room.spectators,
          ].forEach((peer) => {
            peer!.send(JSON.stringify({ type: ActionType.SPECTATOR_JOINED }));
          });
          spectatorIdx = room.spectators.length;
          room.spectators.push(ws);
          break;
        }

        if (!room.players[Player.ONE]) {
          player = Player.ONE;
          room.players[Player.ONE] = ws;
        } else {
          player = Player.TWO;
          room.players[Player.TWO] = ws;
        }

        const opponentPlayer = player === Player.ONE ? Player.TWO : Player.ONE;
        const opponentPlayerConnection = room.players[opponentPlayer];
        sendMessage(ActionType.JOINED_ROOM, {
          player,
          opponentPlayer: opponentPlayerConnection ? opponentPlayer : null,
          slots: room.slots,
          turnPlayer: (room.turn % 2) + 1,
          turn: room.turn,
          spectators: room.spectators.length,
        });
        opponentPlayerConnection?.send(
          JSON.stringify({
            type: ActionType.OPPONENT_JOINED,
            payload: { opponentPlayer },
          })
        );
        break;
      }
      default:
        console.log("New event", action.type);
    }
  });

  ws.on("close", () => {
    if (!player) {
      room?.spectators.splice(spectatorIdx, 1);
      return;
    }

    const opponentPlayer = player === Player.ONE ? Player.TWO : Player.ONE;
    const opponentPlayerConnection = room?.players[opponentPlayer];
    opponentPlayerConnection?.send(
      JSON.stringify({
        type: ActionType.OPPONENT_LEFT,
      })
    );

    delete room?.players[player];
  });

  function sendMessage(type: ActionType, payload?: any) {
    ws.send(JSON.stringify({ type, payload }));
  }
});
