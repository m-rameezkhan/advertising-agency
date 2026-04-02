import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export function useNotifications() {
  const [items, setItems] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("alerts:history", (history) => setItems(history));
    socket.on("alerts:new", (alert) => {
      setItems((current) => [alert, ...current].slice(0, 20));
    });

    return () => socket.close();
  }, []);

  const unread = useMemo(() => items.filter((item) => !item.read).length, [items]);

  return {
    items,
    unread,
    connected,
    markAllRead: () => setItems((current) => current.map((item) => ({ ...item, read: true })))
  };
}
