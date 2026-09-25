import { ChatIcon, RobotIcon } from "@/assets/icons";

interface MenuItem {
  path?: string;
  label: string;
  icon: React.ReactNode | (() => React.ReactNode);
  children?: MenuItem[];
  isCountHas?: boolean;
}

// Страницы робота пока не существует — пункт вёл на несуществующий маршрут
// и открывал белый экран. Вернуть в true, когда страница появится.
const SHOW_CHAT_BOT = false;

const adminMenu: MenuItem[] = [
  { path: "/", label: "Чат", icon: ChatIcon, isCountHas: false },
  ...(SHOW_CHAT_BOT
    ? [
        {
          path: "/chat-bot",
          label: "Робот",
          icon: RobotIcon,
          isCountHas: false,
        } as MenuItem,
      ]
    : []),
];

export default adminMenu;
