import cls from "classnames";
import { Player } from "../hooks/useGame";

type PieceProps = {
  player: Player;
  currentPlayer?: Player;
  onClick?: () => void;
  size?: "sm" | "base";
  highlighted?: boolean;
  isGameOver?: boolean;
};

const hoverClassesByPlayer = {
  "1": "group-hover:last-of-type:bg-yellow-200 group-hover:border-yellow-500",
  "2": "group-hover:last-of-type:bg-red-200 group-hover:border-red-500",
} as const;

const classesByPlayer = {
  "1": "bg-yellow-500",
  "2": "bg-red-500",
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
