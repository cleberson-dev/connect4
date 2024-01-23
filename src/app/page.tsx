"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingModal from "./components/loading-modal";

let ws: WebSocket;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    ws = new WebSocket("ws://localhost:8080");
    ws.onclose = (err) => {
      console.error("OOPS :(", err);
    };
    ws.onmessage = ({ data }) => {
      const action = JSON.parse(data);

      switch (action.type) {
        case "ROOM_CREATED":
          const { roomId } = action.payload;
          router.push(`/room/${roomId}`);
        default: {
          console.log("New Event:", action);
        }
      }
    };

    return () => ws.close();
  }, []);

  return (
    <>
      <LoadingModal open={isLoading} />
      <main className="flex h-[100svh] flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-black">Connect4</h1>
        <button
          className="p-2 rounded shadow-sm bg-blue-500 text-white text-sm mt-5 hover:bg-blue-600 transition-colors"
          onClick={() => {
            setIsLoading(true);
            ws.send(JSON.stringify({ type: "CREATE_ROOM" }));
          }}
        >
          Create Room
        </button>
      </main>
    </>
  );
}
