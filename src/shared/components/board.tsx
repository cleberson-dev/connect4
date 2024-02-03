import cls from "classnames";
import Piece from "@/shared/components/piece";
import { WinnerCheckerResults } from "@/shared/types";
import { Player, Slots } from "@/shared/types";
import { getLabelBasedOnSlotPosition } from "@/shared/utils";

const isProd = process.env.NODE_ENV === "production";

type BoardProps = {
  slots: Slots;
  player: Player | null;
  turnPlayer: Player;
  gameWinner: WinnerCheckerResults | null;
  onColumnClick?: (colNumber: number) => void;
  playable?: boolean;
};

export default function Board({
  slots,
  player,
  turnPlayer,
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

  const isPlayersTurn = player === turnPlayer;

  const getLabel = getLabelBasedOnSlotPosition(slots[0].length);

  return (
    <>
      <div className="bg-blue-700 rounded shadow flex gap-5 sm:gap-8 p-4 select-none">
        {slots.map((col, colNumber) => (
          <div
            key={colNumber}
            className={cls("flex flex-col group gap-3 sm:gap-6", {
              "cursor-pointer":
                playable && isPlayersTurn && !isColFull(colNumber),
            })}
            onClick={() =>
              playable &&
              isPlayersTurn &&
              !isColFull(colNumber) &&
              onColumnClick?.(colNumber)
            }
          >
            {col.map((player, rowNumber) => (
              <Piece
                key={rowNumber}
                player={player}
                turnPlayer={turnPlayer}
                hoverable={playable && isPlayersTurn}
                highlighted={isPieceHighlighted(player, colNumber, rowNumber)}
                label={!isProd ? getLabel(colNumber, rowNumber) : ""}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
