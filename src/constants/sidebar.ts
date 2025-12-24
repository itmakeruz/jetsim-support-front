import { MessageCircleMore, type LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

interface MenuItem {
  path?: string;
  label: string;
  icon: LucideIcon | IconType;
  children?: MenuItem[];
  isCountHas?: boolean;
}

const adminMenu: MenuItem[] = [
  { path: "/", label: "Чат", icon: MessageCircleMore, isCountHas: true },
];

export default adminMenu;
export type { MenuItem };
