export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  UP_LEFT,
  UP_RIGHT,
  DOWN_LEFT,
  DOWN_RIGHT,
}

export type WinnerCheckerResults = {
  player: Player.ONE | Player.TWO;
  coords: [number, number][];
};

export enum Player {
  ONE = 1,
  TWO = 2,
}

export type Slots = (Player | null)[][];

type RoomPlayer = {
  name?: string;
  online?: boolean;
};

export type Spectator = {
  id: string;
  name: string;
};

export type Room = {
  id: string;
  name: string;
  password: string;
  slots: Slots;
  players: Record<Player, RoomPlayer>;
  turn: number;
  spectators: Spectator[];
  creationDate: Date;
};

export enum ResponseActionType {
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  JOINED_ROOM = "JOINED_ROOM",
  SET_PIECE = "SET_PIECE",
  RESTART_GAME = "RESTART_GAME",
  OPPONENT_JOINED = "OPPONENT_JOINED",
  OPPONENT_LEFT = "OPPONENT_LEFT",
  SPECTATOR_JOINED = "SPECTATOR_JOINED",
  SPECTATOR_LEFT = "SPECTATOR_LEFT",
}

export enum RequestActionType {
  JOIN_ROOM = "JOIN_ROOM",
  SET_PIECE = "SET_PIECE",
  RESTART_GAME = "RESTART_GAME",
}

export type GameCheckerFn = (args: {
  player: Player;
  currentCoord: [number, number];
  count?: number;
  direction?: Direction;
  lastCoords?: [number, number][];
}) => WinnerCheckerResults | null;
