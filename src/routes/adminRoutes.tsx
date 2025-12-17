import { lazy, type ReactElement } from "react";

// Lazy load all pages for code splitting
const ChatPage = lazy(() => import("@/pages/chat/ChatPage"));
const UsersPage = lazy(() => import("@/pages/users/UserPage"));

interface RouteConfig {
  path: string;
  element: ReactElement;
  children?: RouteConfig[];
}

export const adminRoutes: RouteConfig[] = [
  { path: "/", element: <ChatPage /> },

  // Пользователи
  {
    path: "/users",
    element: <UsersPage />,
  },
];

export type { RouteConfig };
