import { AllChatIcon } from "@/assets/icons";
import type { FilterType } from "@/types/chat";
import { Archive, FlagOff, Trash2, UserPlus } from "lucide-react";

export const filterOptions: {
  value: FilterType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "all", label: "Все чаты", icon: AllChatIcon },
  { value: "active", label: "Активные контакты", icon: UserPlus },
  { value: "archived", label: "Архивные чаты", icon: Archive },
  { value: "spam", label: "Спам-сообщения", icon: FlagOff },
  { value: "trash", label: "Корзина", icon: Trash2 },
];
