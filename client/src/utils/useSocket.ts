import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketOptions {
  url: string; 
  options?: object; 
}

export const useSocket = ({ url, options }: UseSocketOptions) => {
  const socket = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.current = io(url, options);

    socket.current.on("connect", () => {
      console.log("Connected:", socket.current?.id);
      setIsConnected(true);
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected");
      setIsConnected(false);
    });

    socket.current.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [url, options]);

  const emitEvent = (event: string, data: any) => {
    socket.current?.emit(event, data);
  };

  const onEvent = (event: string, callback: (data: any) => void) => {
    socket.current?.on(event, callback);
  };

  return { socket: socket.current, isConnected, emitEvent, onEvent };
};