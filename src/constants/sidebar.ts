import { ChatIcon, RobotIcon } from "@/assets/icons";

interface MenuItem {
  path?: string;
  label: string;
  icon: React.ReactNode | (() => React.ReactNode);
  children?: MenuItem[];
  isCountHas?: boolean;
}

const adminMenu: MenuItem[] = [
  { path: "/", label: "Чат", icon: ChatIcon, isCountHas: false },
  { path: "/chat-bot", label: "Робот", icon: RobotIcon, isCountHas: false },
];

export default adminMenu;
