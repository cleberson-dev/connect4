import { useEffect, useState } from "react";
import { UserIcon, EyeIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import apiService, { ApiRoom } from "@/app/services/api.service";

export default function RoomsListModal() {
  const [rooms, setRooms] = useState<ApiRoom[]>([]);

  useEffect(() => {
    apiService.getRooms().then((res) => {
      setRooms(res.data);
    });
  }, []);

  return (
    <ul className="bg-white w-3/4 h-3/4">
      {rooms.map((room) => (
        <li
          key={room.id}
          className="px-3 py-5 border-b hover:bg-violet-100/50 transition-colors"
        >
          <Link href={`/room/${room.id}`} className="flex flex-col text-sm">
            <strong>{room.name}</strong>
            <span className="text-gray-300 text-sm flex gap-x-2 mt-1 self-end">
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
