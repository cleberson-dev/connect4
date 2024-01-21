import { WebSocketServer } from "ws";
import { Player, Slots } from "./types";

const { WS_PORT: PORT } = process.env;

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
    [Player.ONE]?: boolean;
    [Player.TWO]?: boolean;
  };
};

const gameState: GameState = {
  slots: createFreshSlots(),
  players: {},
};

const slots = createFreshSlots();

enum ActionType {
  START_GAME = "START_GAME",
  GAME_IS_FULL = "GAME_IS_FULL",
}

type Message<T> = {
  type: ActionType;
  payload: T;
};

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
    gameState.players[Player.ONE] = true;
  } else {
    player = Player.TWO;
    gameState.players[Player.TWO] = true;
  }

  sendMessage(ActionType.START_GAME, { slots, player });

  ws.on("error", console.error);
  ws.on("message", (data) => {
    console.log(`Received: ${data}`);
  });

  ws.on("close", () => {
    gameState.players[player] = false;
  });

  function sendMessage(type: ActionType, payload?: any) {
    ws.send(JSON.stringify({ type, payload }));
  }
});
