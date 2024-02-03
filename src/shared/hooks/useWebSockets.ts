import { useEffect, useRef, useState } from "react";
import { ResponseActionType } from "@/shared/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
if (!WS_URL) throw new Error("No Web Socket URL (WS_URL) found!");

type Args = {
  onOpen?: () => void;
};

export const useWebSockets = ({ onOpen }: Args) => {
  const ws = useRef<WebSocket | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [action, setAction] = useState<{
    type: ResponseActionType;
    payload?: any;
  } | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socket.onerror = console.error;
    socket.onclose = () => {
      setIsReady(false);
    };
    if (onOpen) {
      socket.onopen = () => {
        setIsReady(true);
        onOpen?.();
      };
    }
    socket.onmessage = ({ data }) => {
      setAction(JSON.parse(data));
    };

    ws.current = socket;

    return () => socket.close();
  }, []);

  const sendMessage = (type: string, payload?: Object) => {
    const parsedMessage = JSON.stringify({ type, payload });
    ws.current?.send(parsedMessage);
  };

  return { isReady, action, sendMessage };
};
