import cls from "classnames";
import { Player, Slots, WinnerCheckerResults } from "../hooks/useGame";
import Piece from "./piece";

type BoardProps = {
  slots: Slots;
  currentPlayer: Player;
  gameWinner: WinnerCheckerResults;
  isGameOver?: boolean;
  onColumnClick?: (colNumber: number) => void;
};

export default function Board({
  slots,
  currentPlayer,
  isGameOver,
  onColumnClick,
  gameWinner,
}: BoardProps) {
  const isColFull = (colNumber: number) =>
    slots[colNumber].lastIndexOf(null) === -1;
  const isPieceHighlighted = (
    player: Player,
    colNumber: number,
    rowNumber: number
  ) =>
    !!(
      player &&
      gameWinner &&
      gameWinner.player === player &&
      gameWinner.coords.some(
        (gameWinnerCoords) =>
          gameWinnerCoords.toString() === [colNumber, rowNumber].toString()
      )
    );

  return (
    <>
      <div className="bg-blue-700 rounded shadow flex gap-8 p-4">
        {slots.map((col, colNumber) => (
          <div
            key={colNumber}
            className={cls("flex flex-col group gap-6", {
              "cursor-pointer": !isColFull(colNumber) && !isGameOver,
            })}
            onClick={() =>
              !isGameOver && !isColFull(colNumber) && onColumnClick?.(colNumber)
            }
          >
            {col.map((player, rowNumber) => (
              <Piece
                key={rowNumber}
                player={player}
                currentPlayer={currentPlayer}
                isGameOver={isGameOver}
                highlighted={isPieceHighlighted(player, colNumber, rowNumber)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
