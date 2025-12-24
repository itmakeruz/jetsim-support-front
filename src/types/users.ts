export type UserType = "all" | "new" | "assigned" | "closed";

export type User = {
  id: number;
  name: string;
  avatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessages: number;
  type: UserType;
  saved?: boolean;
};
