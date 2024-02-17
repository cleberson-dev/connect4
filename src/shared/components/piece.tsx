import cls from "classnames";
import { Player } from "@/shared/types";

type PieceProps = {
  player: Player | null;
  hoverPlayer?: Player;
  onClick?: () => void;
  size?: "sm" | "base";
  highlighted?: boolean;
  hoverable?: boolean;
  label?: string;
};

const classesByPlayer = {
  [Player.ONE]: (hovered?: boolean) =>
    cls("bg-yellow-500", {
      "group-hover:last-of-type:bg-yellow-200 group-hover:border-yellow-500":
        hovered,
    }),
  [Player.TWO]: (hovered?: boolean) =>
    cls("bg-red-500", {
      "group-hover:last-of-type:bg-red-200 group-hover:border-red-500": hovered,
    }),
} as const;

const classesBySize = {
  base: "h-8 w-8 sm:h-16 sm:w-16",
  sm: "h-6 w-6 sm:h-8 sm:w-8",
} as const;

export default function Piece({
  player,
  hoverPlayer,
  onClick,
  size = "base",
  highlighted,
  hoverable,
  label,
}: PieceProps) {
  const className = cls(
    "inline-flex border-solid border-black rounded-full font-bold justify-center items-center text-green-700",
    classesBySize[size],
    highlighted ? "border-4" : "border-3",
    player
      ? classesByPlayer[player](hoverable && !!hoverPlayer)
      : "bg-slate-200"
  );

  const isEmpty = player === null;

  const role = "board-piece";

  // Changing only the input element type to leverage last-of-type selectors.
  return isEmpty ? (
    <span role={role} onClick={onClick} className={className}>
      {label}
    </span>
  ) : (
    <div role={role} onClick={onClick} className={className}></div>
  );
}
