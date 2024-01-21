import cls from "classnames";
import { Player, Slots, WinnerCheckerResults } from "../types";
import Piece from "./piece";

type BoardProps = {
  slots: Slots;
  turnPlayer: Player;
  isYourTurn: boolean;
  gameWinner: WinnerCheckerResults | null;
  isGameOver?: boolean;
  onColumnClick?: (colNumber: number) => void;
  playable?: boolean;
};

export default function Board({
  slots,
  turnPlayer,
  isYourTurn,
  isGameOver,
  onColumnClick,
  gameWinner,
  playable = false,
}: BoardProps) {
  const isColFull = (colNumber: number) =>
    slots[colNumber].lastIndexOf(null) === -1;
  const isPieceHighlighted = (
    player: Player | null,
    colNumber: number,
    rowNumber: number
  ) =>
    !!(
      gameWinner?.player === player &&
      gameWinner?.coords.some(
        (gameWinnerCoords) =>
          gameWinnerCoords.toString() === [colNumber, rowNumber].toString()
      )
    );

  return (
    <>
      <div className="bg-blue-700 rounded shadow flex gap-5 sm:gap-8 p-4 select-none">
        {slots.map((col, colNumber) => (
          <div
            key={colNumber}
            className={cls("flex flex-col group gap-3 sm:gap-6", {
              "cursor-pointer":
                !isColFull(colNumber) && !isGameOver && isYourTurn && playable,
            })}
            onClick={() =>
              !isGameOver &&
              isYourTurn &&
              playable &&
              !isColFull(colNumber) &&
              onColumnClick?.(colNumber)
            }
          >
            {col.map((player, rowNumber) => (
              <Piece
                key={rowNumber}
                player={player}
                turnPlayer={turnPlayer}
                isGameOver={isGameOver}
                isYourTurn={isYourTurn}
                playable={playable}
                highlighted={isPieceHighlighted(player, colNumber, rowNumber)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
