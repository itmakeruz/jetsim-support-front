import { io, Socket } from "socket.io-client";
import { TOKEN_KEY } from "@/constants/staticDatas";
import type { Ticket } from "@/types/chat";

let socket: Socket | null = null;
let notificationCallback: ((ticket: Ticket) => void) | null = null;

export const initializeSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  const token = localStorage.getItem(TOKEN_KEY);

  socket = io("https://support-api.jetsim.ru", {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    auth: {
      token: token || "",
    },
    extraHeaders: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  // Notification event listener
  socket.on("notification", (data: any) => {
    // Convert notification data to Ticket format
    console.log(data);

    if (data && data.id) {
      const ticket: Ticket = {
        id: data.id,
        user_name: data.name || "",
        color: "", // Default color, can be updated from API
        last_message: {
          content: data.last_message?.content || "",
          message_id: 0, // Will be updated from API
        },
        user_id: data.id,
        last_request_user: data.name || "",
        push: data.push || 0,
        formatted_date: data.date || "",
        status: "active", // Default status
        request_close: false,
        is_online: data.is_online || false,
      };

      // Call the callback if set
      if (notificationCallback) {
        notificationCallback(ticket);
      }
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const exitChat = (ticketId?: number | null) => {
  if (socket?.connected && ticketId) {
    socket.emit("exitchat", { ticketId });
  }
};

export const setNotificationCallback = (callback: (ticket: Ticket) => void) => {
  notificationCallback = callback;
};

export const removeNotificationCallback = () => {
  notificationCallback = null;
};
