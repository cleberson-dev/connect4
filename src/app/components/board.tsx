"use client";

import { useState } from "react";
import cls from "classnames";

const COLS = 7;
const ROWS = 6;

const slots: ("1" | "2" | null)[][] = [];

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

const whoWon = (slots: ("1" | "2" | null)[][]): "1" | "2" | null => {
  for (let i = 0; i < COLS; i += 1) {
    for (let j = 0; j < ROWS; j += 1) {
      const player = slots[i][j];
      if (player === null) continue;

      const winMatcher = (
        player: "1" | "2",
        i: number,
        j: number,
        count = 1,
        direction?: Direction
      ): "1" | "2" | null => {
        if (player !== slots[i]?.[j]) return null;
        if (count === 4) return player;

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
          return Object.entries(directions).reduce<"1" | "2" | null>(
            (winner, [directionName, direction]) =>
              winner ||
              winMatcher(
                player,
                direction[0],
                direction[1],
                newCount,
                directionName as Direction
              ),
            null
          );
        }

        return winMatcher(
          player,
          directions[direction!][0],
          directions[direction!][1],
          newCount,
          direction!
        );
      };

      const winner = winMatcher(player, i, j);
      if (winner !== null) return winner;
    }
  }
  return null;
};

type PieceProps = {
  player: "1" | "2" | null;
  onClick?: () => void;
  size?: "sm" | "base";
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

  console.log("Who Won? ", whoWon(gameSlots));

  const isColFull = (colNumber: number) =>
    gameSlots[colNumber].lastIndexOf(null) === -1;

  function Piece({ player, onClick, size = "base" }: PieceProps) {
    const className = cls(
      "inline-block border-2 border-solid border-black rounded-full group-hover:border-violet-500 group-hover:last",
      {
        "bg-transparent": player === null,
        "bg-yellow-500": player === "1",
        "bg-blue-500": player === "2",
        "h-16 w-16": size === "base",
        "h-8 w-8": size === "sm",
        "group-hover:last-of-type:bg-yellow-200":
          player === null && currentPlayer === "1",
        "group-hover:last-of-type:bg-blue-200":
          player === null && currentPlayer === "2",
      }
    );

    if (player === null)
      return <span onClick={onClick} className={className}></span>;

    return <div onClick={onClick} className={className}></div>;
  }

  return (
    <>
      <div className="flex justify-between items-center gap-x-1 my-4 w-full fixed top-0 px-4 text-lg">
        <div
          className={cls("flex items-center gap-2 relative", {
            "text-violet-500 font-bold": currentPlayer === "1",
          })}
        >
          <Piece player="1" size="sm" />
          <span>Player 1</span>
          <strong
            className={cls("uppercase absolute -bottom-6 text-sm", {
              hidden: currentPlayer === "2",
            })}
          >
            Your Turn
          </strong>
        </div>
        <div
          className={cls("flex items-center gap-2", {
            "text-violet-500 font-bold": currentPlayer === "2",
          })}
        >
          <Piece player="2" size="sm" />
          <span>Player 2</span>
          <strong
            className={cls("uppercase absolute -bottom-6 right-4 text-sm", {
              hidden: currentPlayer === "1",
            })}
          >
            Your Turn
          </strong>
        </div>
      </div>
      <div className="bg-black/5 rounded shadow flex gap-8 p-4">
        {gameSlots.map((col, colNumber) => (
          <div
            key={colNumber}
            className={cls("flex flex-col group gap-6", {
              "cursor-pointer": !isColFull(colNumber),
            })}
            onClick={() => !isColFull(colNumber) && markSlot(colNumber)}
          >
            {col.map((player, rowNumber) => (
              <Piece key={rowNumber} player={player} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
