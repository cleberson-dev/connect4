import cls from "classnames";

import Piece from "@/shared/components/piece";

import { Player, Slots } from "@/shared/types";
import { getLabelBasedOnSlotPosition } from "@/shared/utils";

const isProd = process.env.NODE_ENV === "production";

type BoardProps = {
  slots: Slots;
  player: Player;
  highlightedSlots?: [number, number][];
  onColumnClick?: (colNumber: number) => void;
  playable?: boolean;
};

export default function Board({
  slots,
  player,
  onColumnClick,
  highlightedSlots,
  playable = false,
}: BoardProps) {
  const isColFree = (colNumber: number) => slots[colNumber].includes(null);

  const isPieceHighlighted = (colNumber: number, rowNumber: number) =>
    !!highlightedSlots?.some(
      (coords) => coords.toString() === [colNumber, rowNumber].toString()
    );

  const getLabel = getLabelBasedOnSlotPosition(slots[0].length);

  return (
    <>
      <div className="bg-blue-700 rounded shadow flex gap-5 sm:gap-8 p-4 select-none">
        {slots.map((col, colNumber) => (
          <div
            key={colNumber}
            className={cls("flex flex-col group gap-3 sm:gap-6", {
              "cursor-pointer": playable && isColFree(colNumber),
            })}
            onClick={() =>
              playable && isColFree(colNumber) && onColumnClick?.(colNumber)
            }
          >
            {col.map((colPlayer, rowNumber) => (
              <Piece
                key={rowNumber}
                player={colPlayer}
                hoverPlayer={player}
                hoverable={playable}
                highlighted={isPieceHighlighted(colNumber, rowNumber)}
                label={!isProd ? getLabel(colNumber, rowNumber) : ""}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
