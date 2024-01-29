import { useEffect, useState } from "react";
import apiService, { ApiRoom } from "@/app/services/api.service";
import RoomsList from "@/app/components/rooms-list";

export default function RoomsListModal() {
  const [isFetching, setIsFetching] = useState(true);
  const [rooms, setRooms] = useState<ApiRoom[]>([]);

  useEffect(() => {
    apiService
      .getRooms()
      .then((res) => {
        setRooms(res.data);
      })
      .finally(() => setIsFetching(false));
  }, []);

  return (
    <div className="bg-white w-3/4 h-3/4">
      {isFetching ? <p>Loading rooms...</p> : <RoomsList rooms={rooms} />}
    </div>
  );
}
