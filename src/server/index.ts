import { WebSocketServer, WebSocket } from "ws";
import { Player, Slots } from "./types";

const { WS_PORT: PORT } = process.env;

const markSlot = (colNumber: number, player: Player) => {
  const col = gameState.slots[colNumber];
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
  hasStarted: boolean;
  turn: number;
};

const gameState: GameState = {
  slots: createFreshSlots(),
  players: {},
  hasStarted: false,
  turn: 0,
};

enum ActionType {
  JOIN_GAME = "JOIN_GAME",
  GAME_IS_FULL = "GAME_IS_FULL",
  SET_PIECE = "SET_PIECE",
  RESTART_GAME = "RESTART_GAME",
  OPPONENT_LEFT = "OPPONENT_LEFT",
  OPPONENT_JOINED = "OPPONENT_JOINED",
}

const server = new WebSocketServer({
  port: PORT ? +PORT : 8080,
});

server.on("listening", () => {
  console.log("WS Socket Server up and running...");
});

server.on("connection", (ws) => {
  if (gameState.players[Player.ONE] && gameState.players[Player.TWO]) {
    sendMessage(ActionType.GAME_IS_FULL);
    ws.close();
    return;
  }

  let player: Player;
  if (!gameState.players[Player.ONE]) {
    player = Player.ONE;
    gameState.players[Player.ONE] = ws;
    gameState.hasStarted = !!gameState.players[Player.TWO];
  } else {
    player = Player.TWO;
    gameState.players[Player.TWO] = ws;
    gameState.hasStarted = !!gameState.players[Player.ONE];
  }

  const opponentPlayer = player === Player.ONE ? Player.TWO : Player.ONE;
  const opponentPlayerConnection = gameState.players[opponentPlayer];
  sendMessage(ActionType.JOIN_GAME, {
    slots: gameState.slots,
    player,
    opponentPlayer: opponentPlayerConnection ? opponentPlayer : null,
    turnPlayer: (gameState.turn % 2) + 1,
  });

  opponentPlayerConnection?.send(
    JSON.stringify({
      type: ActionType.OPPONENT_JOINED,
      payload: { opponentPlayer },
    })
  );

  ws.on("error", console.error);
  ws.on("message", (data) => {
    const opponentPlayerConnection =
      gameState.players[player === Player.ONE ? Player.TWO : Player.ONE];
    const action = JSON.parse(`${data}`);
    if (action.type === ActionType.SET_PIECE) {
      const result = markSlot(action.payload.colNumber, player);
      if (!result) return;

      gameState.turn += 1;
      opponentPlayerConnection?.send(
        JSON.stringify({
          type: ActionType.SET_PIECE,
          payload: { coords: result.coords, player },
        })
      );
    }
    if (action.type === ActionType.RESTART_GAME) {
      gameState.hasStarted = true;
      gameState.slots = createFreshSlots();
      gameState.turn = 0;
      opponentPlayerConnection?.send(
        JSON.stringify({
          type: ActionType.RESTART_GAME,
        })
      );
    }
  });

  ws.on("close", () => {
    const opponentPlayer = player === Player.ONE ? Player.TWO : Player.ONE;
    const opponentPlayerConnection = gameState.players[opponentPlayer];
    opponentPlayerConnection?.send(
      JSON.stringify({
        type: ActionType.OPPONENT_LEFT,
      })
    );

    delete gameState.players[player];
    gameState.hasStarted = false;
  });

  function sendMessage(type: ActionType, payload?: any) {
    ws.send(JSON.stringify({ type, payload }));
  }
});
