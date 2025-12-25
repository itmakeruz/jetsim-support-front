import type { Message } from "@/types/chat";

export type GroupedMessages = {
  date: string;
  label: string;
  items: Message[];
};

export const formatDateLabel = (isoDate: string): string => {
  const dateObj = new Date(isoDate);
  const today = new Date();

  const isToday =
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getDate() === today.getDate();

  if (isToday) return "Сегодня";

  return dateObj.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const groupMessages = (messages: Message[]): GroupedMessages[] => {
  const groups: Record<string, Message[]> = {};

  messages.forEach((message) => {
    const dateKey = message.date.split("T")[0];
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(message);
  });

  return Object.entries(groups)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, items]) => ({
      date,
      label: formatDateLabel(date),
      items,
    }));
};
