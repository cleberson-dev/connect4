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

export enum Player {
  ONE = 1,
  TWO = 2,
}

export type Slots = (Player | null)[][];

export type WinnerCheckerResults = {
  player: Player.ONE | Player.TWO;
  coords: [number, number][];
};
