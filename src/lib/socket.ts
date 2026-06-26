import { io, Socket } from "socket.io-client";
import { TOKEN_KEY } from "@/constants/staticDatas";
import type { NotificationTicket } from "@/types/chat";
import { showToast } from "@/utils/toastHelper";

let socket: Socket | null = null;
let notificationCallback: ((ticket: NotificationTicket) => void) | null = null;
let newMessageCallback: ((data: any) => void) | null = null;

type SocketException = {
  status?: number;
  error?: string;
  message?: string;
};

const getExceptionMessage = (payload: unknown): string => {
  if (Array.isArray(payload)) {
    const errorPayload = payload.find(
      (item): item is SocketException =>
        typeof item === "object" && item !== null && "message" in item
    );

    return (
      errorPayload?.message ||
      payload.find((item): item is string => typeof item === "string") ||
      "Ошибка при отправке сообщения"
    );
  }

  if (typeof payload === "object" && payload !== null) {
    const exception = payload as SocketException;

    return (
      exception.message ||
      exception.error ||
      "Ошибка при отправке сообщения"
    );
  }

  if (typeof payload === "string") {
    return payload;
  }

  return "Ошибка при отправке сообщения";
};

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

  socket.on("exception", (data: unknown) => {
    console.error("Socket exception:", data);
    showToast.error(getExceptionMessage(data));
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

export const sendMessage = (
  ticketId: number,
  message: string,
  replyMessageId?: number
) => {
  if (socket?.connected) {
    const payload: {
      ticket_id: number;
      message: string;
      reply_message_id?: number;
    } = {
      ticket_id: Number(ticketId),
      message: message,
    };

    if (replyMessageId) {
      payload.reply_message_id = replyMessageId;
    }

    socket.emit("sendMessage", payload);
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

export const editMessage = (messageId: number, message: string) => {
  if (socket?.connected) {
    socket.emit("editmessage", {
      message_id: messageId,
      message: message,
    });
  } else {
    console.error("Socket is not connected");
  }
};

export const deleteMessage = (messageId: number) => {
  if (socket?.connected) {
    socket.emit("deletemessage", {
      message_id: messageId,
    });
  } else {
    console.error("Socket is not connected");
  }
};
