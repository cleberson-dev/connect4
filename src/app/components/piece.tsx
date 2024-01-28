import cls from "classnames";
import { Player } from "@/shared/types";

type PieceProps = {
  player: Player | null;
  turnPlayer?: Player;
  onClick?: () => void;
  size?: "sm" | "base";
  highlighted?: boolean;
  playable?: boolean;
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
  turnPlayer,
  onClick,
  size = "base",
  highlighted,
  playable,
}: PieceProps) {
  const isEmpty = player === null;
  const isPlayersTurn = player === turnPlayer;

  const className = cls(
    "inline-block border-solid border-black rounded-full",
    highlighted ? "border-4" : "border-3",
    classesBySize[size],
    player ? classesByPlayer[player] : "bg-slate-200",
    playable && isEmpty && isPlayersTurn && hoverClassesByPlayer[turnPlayer!]
  );

  if (isEmpty) return <span onClick={onClick} className={className}></span>;

  return <div onClick={onClick} className={className}></div>;
}
