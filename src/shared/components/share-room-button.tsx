import { LinkIcon } from "@heroicons/react/16/solid";

type Props = {
  onClick: () => void;
};

export default function ShareRoomButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      title="Share Room"
      className="hover:text-blue-500 z-20"
    >
      <LinkIcon className="w-6 h-6" />
    </button>
  );
}
