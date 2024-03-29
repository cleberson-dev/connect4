import cls from "classnames";

import Piece from "@/shared/components/piece";

import { Player, Slots } from "@/shared/types";
import { getLabelBasedOnSlotPosition } from "@/shared/utils";
import { useMemo } from "react";

type BoardProps = {
  slots: Slots;
  player: Player;
  highlightedSlots?: [number, number][];
  playable?: boolean;
  showLabels?: boolean;
  onColumnClick?: (colNumber: number) => void;
};

export default function Board({
  slots,
  player,
  onColumnClick,
  highlightedSlots,
  playable,
  showLabels,
}: BoardProps) {
  const isColFree = (colNumber: number) => slots[colNumber].includes(null);

  const isPieceHighlighted = (colNumber: number, rowNumber: number) =>
    !!highlightedSlots?.some(
      (coords) => coords.toString() === [colNumber, rowNumber].toString()
    );

  const slotsRowLength = slots[0]?.length ?? 0;

  const getLabel = useMemo(
    () => getLabelBasedOnSlotPosition(slotsRowLength),
    [slotsRowLength]
  );

  return (
    <div
      className="bg-blue-700 rounded shadow flex gap-5 sm:gap-8 p-4 select-none"
      data-testid="board"
    >
      {slots.map((col, colNumber) => (
        <div
          key={colNumber}
          className={cls(
            { "pointer-events-auto": playable && isColFree(colNumber) },
            "flex flex-col group gap-3 sm:gap-6 pointer-events-none"
          )}
          onClick={() => onColumnClick?.(colNumber)}
        >
          {col.map((colPlayer, rowNumber) => (
            <Piece
              key={rowNumber}
              player={colPlayer}
              hoverable={playable && colPlayer === null}
              hoverPlayer={player}
              highlighted={isPieceHighlighted(colNumber, rowNumber)}
              label={showLabels ? getLabel(colNumber, rowNumber) : ""}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
