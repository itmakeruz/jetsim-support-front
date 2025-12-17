import {
  MessageCircleMore,
  Package,
  UserRoundCog,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
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
  { path: "/users", label: "Пользователи", icon: Users, isCountHas: false },
  {
    label: "Пользователи",
    icon: Users,
    children: [
      {
        path: "/users/drivers",
        label: "Водители",
        icon: UsersRound,
      },
      {
        path: "/users/cargo-owners",
        label: "Грузовладельцы",
        icon: Package,
      },
      {
        path: "/users/administrators",
        label: "Администраторы",
        icon: UserRoundCog,
      },
    ],
  },
];

export default adminMenu;
export type { MenuItem };
