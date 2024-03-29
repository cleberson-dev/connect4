import { EyeIcon, UserIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

type RoomsListProps = {
  rooms: {
    id: string;
    name: string;
    players: number;
    spectators: number;
  }[];
};

export default function RoomsList({ rooms }: RoomsListProps) {
  if (rooms.length === 0)
    return (
      <div
        data-testid="rooms-list"
        className="flex items-center justify-center h-full"
      >
        <p className="font-bold uppercase text-sm">No rooms Available</p>
      </div>
    );

  return (
    <ul data-testid="rooms-list">
      {rooms.map((room) => (
        <li
          key={room.id}
          className="px-3 py-5 border-b hover:bg-violet-100/50 transition-colors"
        >
          <Link href={`/room/${room.id}`} className="flex flex-col text-sm">
            <strong>{room.name}</strong>
            <span className="text-gray-300 flex gap-x-2 mt-1 self-end">
              <small className="flex items-center gap-x-1">
                {room.players}/2
                <UserIcon className="w-3 h-3" />
              </small>
              <small className="flex items-center gap-x-1">
                {room.spectators}
                <EyeIcon className="w-3 h-3" />
              </small>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
