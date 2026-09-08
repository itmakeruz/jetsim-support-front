import { io, Socket } from "socket.io-client";
import { TOKEN_KEY } from "@/constants/staticDatas";
import type { NotificationTicket } from "@/types/chat";
import { showToast } from "@/utils/toastHelper";

type SocketResult<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: { message?: string };
};

type Unsubscribe = () => void;

let socket: Socket | null = null;
const notificationListeners = new Set<(ticket: NotificationTicket) => void>();
const newMessageListeners = new Set<(data: unknown) => void>();
const updateMessageListeners = new Set<(data: unknown) => void>();
const removeMessageListeners = new Set<(data: unknown) => void>();
const connectListeners = new Set<() => void>();

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://support-api.jetsim.ru";

const subscribe = <T>(listeners: Set<(data: T) => void>, callback: (data: T) => void): Unsubscribe => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

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
  if (socket) return socket;

  const token = localStorage.getItem(TOKEN_KEY) || "";
  socket = io(socketUrl, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: Infinity,
    transportOptions: {
      polling: { extraHeaders: { token } },
    },
  });

  socket.on("exception", (data: unknown) => {
    console.error("Socket exception:", data);
    showToast.error(getExceptionMessage(data));
  });
  socket.on("connect", () => connectListeners.forEach((callback) => callback()));
  socket.on("notification", (data: NotificationTicket) => notificationListeners.forEach((callback) => callback(data)));
  socket.on("newMessage", (data: unknown) => newMessageListeners.forEach((callback) => callback(data)));
  socket.on("updatemessage", (data: unknown) => updateMessageListeners.forEach((callback) => callback(data)));
  socket.on("removemessage", (data: unknown) => removeMessageListeners.forEach((callback) => callback(data)));

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const reconnectSocket = () => {
  disconnectSocket();
  return initializeSocket();
};

export const getSocket = () => socket;

export const subscribeNotification = (callback: (ticket: NotificationTicket) => void) =>
  subscribe(notificationListeners, callback);
export const subscribeNewMessage = (callback: (data: unknown) => void) => subscribe(newMessageListeners, callback);
export const subscribeUpdatedMessage = (callback: (data: unknown) => void) => subscribe(updateMessageListeners, callback);
export const subscribeRemovedMessage = (callback: (data: unknown) => void) => subscribe(removeMessageListeners, callback);
export const subscribeSocketConnected = (callback: () => void) => {
  connectListeners.add(callback);
  return () => {
    connectListeners.delete(callback);
  };
};

const emitWithAck = <T>(event: string, payload: object): Promise<SocketResult<T>> =>
  new Promise((resolve) => {
    if (!socket?.connected) {
      resolve({ ok: false, error: { message: "Socket is not connected" } });
      return;
    }

    const timeout = window.setTimeout(() => {
      resolve({ ok: false, error: { message: "Server response timed out" } });
    }, 10_000);

    socket.emit(event, payload, (response: SocketResult<T>) => {
      window.clearTimeout(timeout);
      resolve(response || { ok: false, error: { message: "Invalid server response" } });
    });
  });

export const exitChat = (ticketId?: number | null) =>
  ticketId ? emitWithAck("exitchat", { ticket_id: ticketId }) : Promise.resolve({ ok: true });

export const sendMessage = (ticketId: number, message: string, replyMessageId?: number) =>
  emitWithAck("sendMessage", {
    ticket_id: Number(ticketId),
    message,
    ...(replyMessageId ? { reply_message_id: replyMessageId } : {}),
  });

export const editMessage = (messageId: number, message: string) =>
  emitWithAck("editmessage", { message_id: messageId, message });

export const deleteMessage = (messageId: number) =>
  emitWithAck("deletemessage", { message_id: messageId });
