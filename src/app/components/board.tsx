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

type PieceProps = {
  player: "1" | "2" | null;
  onClick?: () => void;
};

function Piece({ player, onClick }: PieceProps) {
  return (
    <div
      onClick={onClick}
      className={cls({
        "h-16 w-16 border-2 border-solid border-black rounded-full group-hover:border-violet-500":
          true,
        "bg-transparent": player === null,
        "bg-yellow-500": player === "1",
        "bg-blue-500": player === "2",
      })}
    ></div>
  );
}

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

  const isColFull = (colNumber: number) =>
    gameSlots[colNumber].lastIndexOf(null) === -1;

  return (
    <>
      <div className="flex items-center gap-x-1 my-4">
        <Piece player={currentPlayer} />
        Turn
      </div>
      <div className="bg-white rounded shadow flex gap-8 p-4">
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
