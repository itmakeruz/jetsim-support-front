import { io, Socket } from "socket.io-client";
import { TOKEN_KEY } from "@/constants/staticDatas";
import type { NotificationTicket } from "@/types/chat";

let socket: Socket | null = null;
let notificationCallback: ((ticket: NotificationTicket) => void) | null = null;
let newMessageCallback: ((data: any) => void) | null = null;

export const initializeSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    token: token || "",
  };
  socket = io("https://support-api.jetsim.ru", {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    transportOptions: {
      polling: {
        extraHeaders: headers,
      },
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
      const ticket: NotificationTicket = {
        id: data.ticket_id,
        ticket_id: data.ticket_id,
        last_message: {
          content: data.last_message?.content || "",
        },
        push: data.push || 0,
        date: data.date || "",
      };

      // Call the callback if set
      if (notificationCallback) {
        notificationCallback(ticket);
      }
    }
  });

  // NewMessage event listener
  socket.on("newMessage", (data: any) => {
    console.log("newMessage event received:", data);

    // Call the callback if set
    if (newMessageCallback) {
      newMessageCallback(data);
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

export const reconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  return initializeSocket();
};

export const getSocket = () => socket;

export const exitChat = (ticketId?: number | null) => {
  if (socket?.connected && ticketId) {
    socket.emit("exitchat", { ticketId });
  }
};

export const setNotificationCallback = (
  callback: (ticket: NotificationTicket) => void
) => {
  notificationCallback = callback;
};

export const removeNotificationCallback = () => {
  notificationCallback = null;
};

export const sendMessage = (ticketId: number, message: string) => {
  if (socket?.connected) {
    socket.emit("sendMessage", {
      ticket_id: Number(ticketId),
      message: message,
    });
  } else {
    console.error("Socket is not connected");
  }
};

export const setNewMessageCallback = (callback: (data: any) => void) => {
  newMessageCallback = callback;
};

export const removeNewMessageCallback = () => {
  newMessageCallback = null;
};
