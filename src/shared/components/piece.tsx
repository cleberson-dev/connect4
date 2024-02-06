import cls from "classnames";
import { Player } from "@/shared/types";

type PieceProps = {
  player: Player | null;
  hoverPlayer: Player;
  onClick?: () => void;
  size?: "sm" | "base";
  highlighted?: boolean;
  hoverable?: boolean;
  label?: string;
};

const hoverClassesByPlayer = {
  [Player.ONE]:
    "group-hover:last-of-type:bg-yellow-200 group-hover:border-yellow-500",
  [Player.TWO]:
    "group-hover:last-of-type:bg-red-200 group-hover:border-red-500",
} as const;

const classesByPlayer = {
  [Player.ONE]: "bg-yellow-500",
  [Player.TWO]: "bg-red-500",
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
  const isEmpty = player === null;

  const className = cls(
    "inline-flex border-solid border-black rounded-full font-bold justify-center items-center text-green-700",
    highlighted ? "border-4" : "border-3",
    classesBySize[size],
    player ? classesByPlayer[player] : "bg-slate-200",
    hoverable && isEmpty && hoverClassesByPlayer[hoverPlayer!]
  );

  if (isEmpty)
    return (
      <span onClick={onClick} className={className}>
        {label}
      </span>
    );

  return <div onClick={onClick} className={className}></div>;
}
