import { useGame } from "../contexts/Game.context";

export default function GameFooter() {
  const {
    state: { turn },
  } = useGame();

  return (
    <footer className="fixed bottom-4 p-2 w-full flex justify-center items-center">
      <p className="absolute w-full text-center">Turn {turn + 1}</p>
    </footer>
  );
}
