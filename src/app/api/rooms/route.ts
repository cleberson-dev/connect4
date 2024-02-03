import { getRoomsList } from "@/shared/utils/data";

export async function GET() {
  const rooms = await getRoomsList();
  return Response.json(rooms);
}
