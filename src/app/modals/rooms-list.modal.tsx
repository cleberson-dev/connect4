import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import apiService from "@/app/services/api.service";
import RoomsList from "@/app/components/rooms-list";

export default function RoomsListModal() {
  const {
    isPending,
    data: rooms = [],
    error,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => apiService.getRooms(),
  });

  useEffect(() => {
    if (!error) return;
    console.error("[GET ROOMS]: ", error);
    toast.error("Something occurred while getting the rooms...");
  }, [error]);

  return (
    <div className="bg-white w-3/4 h-3/4">
      {isPending ? <p>Loading rooms...</p> : <RoomsList rooms={rooms} />}
    </div>
  );
}
