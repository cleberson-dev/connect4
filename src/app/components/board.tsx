"use client";

import { useEffect, useState } from "react";
import cls from "classnames";

const COLS = 7;
const ROWS = 6;

type Player = "1" | "2" | null;

const slots: Player[][] = [];

for (let i = 0; i < COLS; i += 1) {
  slots[i] = [];
  for (let j = 0; j < ROWS; j += 1) {
    slots[i][j] = null;
  }
}

type Direction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "upLeft"
  | "upRight"
  | "downLeft"
  | "downRight";

type WinnerCheckerResults = {
  player: "1" | "2";
  coords: [number, number][];
} | null;

const whoWon = (slots: Player[][]): WinnerCheckerResults => {
  for (let i = 0; i < COLS; i += 1) {
    for (let j = 0; j < ROWS; j += 1) {
      const player = slots[i][j];
      if (player === null) continue;

      const winMatcher = (
        player: "1" | "2",
        i: number,
        j: number,
        count = 1,
        direction?: Direction,
        coords: [number, number][] = []
      ): WinnerCheckerResults => {
        if (player !== slots[i]?.[j]) return null;
        if (count === 4)
          return {
            player,
            coords,
          };

        const newCount = count + 1;

        const directions = {
          left: [i - 1, j],
          right: [i + 1, j],
          up: [i, j - 1],
          down: [i, j + 1],
          upLeft: [i - 1, j - 1],
          upRight: [i + 1, j - 1],
          downLeft: [i - 1, j + 1],
          downRight: [i + 1, j + 1],
        } as const;

        if (count === 1) {
          return Object.entries(directions).reduce<WinnerCheckerResults>(
            (winner, [directionName, direction]) =>
              winner ??
              winMatcher(
                player,
                direction[0],
                direction[1],
                newCount,
                directionName as Direction,
                [...coords, [direction[0], direction[1]]]
              ),
            null
          );
        }

        const directionIndices = directions[direction!];

        return winMatcher(
          player,
          directionIndices[0],
          directionIndices[1],
          newCount,
          direction!,
          [...coords, [directionIndices[0], directionIndices[1]]]
        );
      };

      const winner = winMatcher(player, i, j, 1, undefined, [[i, j]]);
      if (winner !== null) return winner;
    }
  }
  return null;
};

type PieceProps = {
  player: Player;
  onClick?: () => void;
  size?: "sm" | "base";
  highlighted?: boolean;
};

export default function Board() {
  const [currentPlayer, setCurrentPlayer] = useState<"1" | "2">("1");
  const [gameSlots, setGameSlots] = useState(slots);

  const changePlayer = () =>
    setCurrentPlayer((previousPlayer) => (previousPlayer === "1" ? "2" : "1"));

  const markSlot = (colNumber: number) => {
    setGameSlots((prevGameSlots) => {
      const selectedColumn = [...prevGameSlots[colNumber]];
      const lastIndexOfNull = selectedColumn.lastIndexOf(null);

      if (lastIndexOfNull === -1) return prevGameSlots;

      const newColumn = selectedColumn.toSpliced(
        lastIndexOfNull,
        1,
        currentPlayer
      );
      return prevGameSlots.toSpliced(colNumber, 1, newColumn);
    });
    changePlayer();
  };

  const gameWinner = whoWon(gameSlots);
  const isGameOver = gameWinner !== null;

  useEffect(() => {
    if (isGameOver) {
      alert(`Player ${gameWinner.player} won!`);
    }
  }, [isGameOver]);

  const isColFull = (colNumber: number) =>
    gameSlots[colNumber].lastIndexOf(null) === -1;

  function Piece({ player, onClick, size = "base", highlighted }: PieceProps) {
    const isEmpty = player === null;
    const className = cls(
      "inline-block border-2 border-solid border-black rounded-full group-hover:last",
      {
        "bg-slate-200": isEmpty,
        "bg-yellow-500": player === "1",
        "bg-red-500": player === "2",
        "h-16 w-16": size === "base",
        "h-8 w-8": size === "sm",
        "group-hover:last-of-type:bg-yellow-200 group-hover:border-yellow-500":
          isEmpty && currentPlayer === "1",
        "group-hover:last-of-type:bg-red-200 group-hover:border-red-500":
          isEmpty && currentPlayer === "2",
        "border-4 border-orange-500": highlighted,
      }
    );

    if (isEmpty) return <span onClick={onClick} className={className}></span>;

    return <div onClick={onClick} className={className}></div>;
  }

  return (
    <>
      <div className="flex justify-between items-center gap-x-1 my-4 w-full fixed top-0 px-4 text-lg">
        <div
          className={cls("flex items-center gap-2 relative", {
            "text-violet-500 font-bold": !isGameOver && currentPlayer === "1",
          })}
        >
          <Piece player="1" size="sm" />
          <span>Player 1</span>
          <strong
            className={cls("uppercase absolute -bottom-6 text-sm", {
              hidden: isGameOver || currentPlayer === "2",
            })}
          >
            Your Turn
          </strong>
        </div>
        <div
          className={cls("flex items-center gap-2", {
            "text-violet-500 font-bold": !isGameOver && currentPlayer === "2",
          })}
        >
          <Piece player="2" size="sm" />
          <span>Player 2</span>
          <strong
            className={cls("uppercase absolute -bottom-6 right-4 text-sm", {
              hidden: isGameOver || currentPlayer === "1",
            })}
          >
            Your Turn
          </strong>
        </div>
      </div>
      <div className="bg-blue-700 rounded shadow flex gap-8 p-4">
        {gameSlots.map((col, colNumber) => (
          <div
            key={colNumber}
            className={cls("flex flex-col group gap-6", {
              "cursor-pointer": !isColFull(colNumber),
            })}
            onClick={() => !isColFull(colNumber) && markSlot(colNumber)}
          >
            {col.map((player, rowNumber) => (
              <Piece
                key={rowNumber}
                player={player}
                highlighted={
                  !!(
                    player &&
                    gameWinner &&
                    gameWinner.player === player &&
                    gameWinner.coords.some(
                      (gameWinnerCoords) =>
                        gameWinnerCoords.toString() ===
                        [colNumber, rowNumber].toString()
                    )
                  )
                }
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
