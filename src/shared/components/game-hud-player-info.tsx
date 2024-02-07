import cls from "classnames";
import { Player } from "@/shared/types";
import Piece from "@/shared/components/piece";

type Props = {
  player: Player;
  name?: string;
  isPlayersTurn?: boolean;
  offline?: boolean;
  isCurrentPlayer?: boolean;
};

const defaultNamesByPlayer: Record<Player, string> = {
  [Player.ONE]: "Player 1",
  [Player.TWO]: "Player 2",
};

export default function GameHudPlayerInfo({
  player,
  name,
  isPlayersTurn,
  isCurrentPlayer,
  offline = true,
}: Props) {
  const nameText = `${name || defaultNamesByPlayer[player]} ${
    isCurrentPlayer && "(YOU)"
  }`;

  return (
    <div
      className={cls(
        "flex items-center gap-1 sm:gap-2 relative",
        isPlayersTurn && "text-violet-500 font-bold",
        offline && "opacity-10"
      )}
      title={offline ? "Waiting for opponent" : ""}
    >
      <Piece player={player} size="sm" />
      <span>{nameText}</span>
      {isPlayersTurn && (
        <strong className="uppercase absolute -bottom-5 sm:-bottom-6 left-0 w-full text-xs sm:text-sm">
          Turn
        </strong>
      )}
    </div>
  );
}
