import { Player } from "@/shared/types";

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
