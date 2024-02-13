import SpectatorsCounter from "@/shared/components/spectators-counter";
import ShareRoomButton from "@/shared/components/share-room-button";
import { useGameStore } from "../stores/game.store";

type Props = {
  showSpectators?: boolean;
  showShareButton?: boolean;
};

export default function GameFooter({ showSpectators, showShareButton }: Props) {
  const {
    state: { turn, spectators },
  } = useGameStore();

  const shareRoom = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

  return (
    <footer className="fixed bottom-4 p-2 w-full flex justify-between items-center">
      {showSpectators && <SpectatorsCounter spectators={spectators} />}

      <p className="absolute w-full text-center">Turn {turn + 1}</p>

      {showShareButton && <ShareRoomButton onClick={shareRoom} />}
    </footer>
  );
}
