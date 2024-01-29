import apiService from "@/app/services/api.service";
import RoomsList from "@/app/components/rooms-list";
import { useQuery } from "@tanstack/react-query";

export default function RoomsListModal() {
  const { isPending, data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => apiService.getRooms(),
  });

  return (
    <div className="bg-white w-3/4 h-3/4">
      {isPending ? <p>Loading rooms...</p> : <RoomsList rooms={rooms} />}
    </div>
  );
}
