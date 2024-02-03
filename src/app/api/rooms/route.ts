import { getRoomsList } from "@/server/data-source";

export async function GET() {
  const rooms = await getRoomsList();
  return Response.json(rooms);
}
