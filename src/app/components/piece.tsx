import cls from "classnames";
import { Player } from "../types";

type PieceProps = {
  player: Player | null;
  currentPlayer?: Player;
  onClick?: () => void;
  size?: "sm" | "base";
  highlighted?: boolean;
  isGameOver?: boolean;
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
  base: "h-16 w-16",
  sm: "h-8 w-8",
} as const;

export default function Piece({
  player,
  onClick,
  size = "base",
  highlighted,
  isGameOver,
  currentPlayer,
}: PieceProps) {
  const isEmpty = player === null;

  const className = cls(
    "inline-block border-solid border-black rounded-full",
    highlighted ? "border-4" : "border-3",
    classesBySize[size],
    player ? classesByPlayer[player] : "bg-slate-200",
    !isGameOver && isEmpty && hoverClassesByPlayer[currentPlayer!]
  );

  if (isEmpty) return <span onClick={onClick} className={className}></span>;

  return <div onClick={onClick} className={className}></div>;
}
