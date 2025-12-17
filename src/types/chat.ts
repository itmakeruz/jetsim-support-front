export type Message = {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  date: string; // ISO date e.g. 2025-12-17
  attachments?: string[];
};
