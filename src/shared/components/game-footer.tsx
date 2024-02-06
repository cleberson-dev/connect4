import { useGame } from "@/shared/contexts/Game.context";
import SpectatorsCounter from "./spectators-counter";
import ShareRoomButton from "./share-room-button";

type Props = {
  showSpectators?: boolean;
  showShare?: boolean;
};

export default function GameFooter({ showSpectators, showShare }: Props) {
  const {
    state: { turn, spectators },
  } = useGame();

  const shareRoom = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

  return (
    <footer className="fixed bottom-4 p-2 w-full flex justify-between items-center">
      {showSpectators && <SpectatorsCounter spectators={spectators} />}

      <p className="absolute w-full text-center">Turn {turn + 1}</p>

      {showShare && <ShareRoomButton onClick={shareRoom} />}
    </footer>
  );
}
