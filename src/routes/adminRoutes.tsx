import { lazy, type ReactElement } from "react";

// Lazy load all pages for code splitting
const ChatPage = lazy(() => import("@/pages/chat/ChatPage"));

interface RouteConfig {
  path: string;
  element: ReactElement;
  children?: RouteConfig[];
}

export const adminRoutes: RouteConfig[] = [
  { path: "/", element: <ChatPage /> },
];

export type { RouteConfig };
