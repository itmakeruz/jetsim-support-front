export type Message = {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  date: string; // ISO date e.g. 2025-12-17
  attachments?: string[];
};

export type Ticket = {
  id: number;
  userId: number;
  userName?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  status?: string;
  // Add other ticket fields as needed
};

export type TicketsResponse = {
  data: Ticket[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};
