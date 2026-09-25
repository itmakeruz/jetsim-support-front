import { useEffect, useRef } from "react";
import { ExternalLink, Link2, Pin, PinOff } from "lucide-react";
import { showToast } from "@/utils/toastHelper";

interface ChatContextMenuProps {
  ticketId: number;
  userName: string;
  isPinned: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onTogglePin: () => void;
}

const MENU_WIDTH = 220;
const MENU_HEIGHT = 150;

export default function ChatContextMenu({
  ticketId,
  userName,
  isPinned,
  position,
  onClose,
  onTogglePin,
}: ChatContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const chatUrl = `${window.location.origin}/?userId=${ticketId}`;

  // Держим меню в пределах окна
  const left = Math.min(position.x, window.innerWidth - MENU_WIDTH);
  const top = Math.min(position.y, window.innerHeight - MENU_HEIGHT);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(chatUrl);
      showToast.success("Ссылка на чат скопирована");
    } catch {
      showToast.error("Не удалось скопировать ссылку");
    }
    onClose();
  };

  const itemClass =
    "w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent flex items-center gap-3 transition-colors";

  return (
    <div
      ref={menuRef}
      style={{ left, top, minWidth: MENU_WIDTH }}
      className="fixed z-50 rounded-lg border border-border bg-popover py-2 text-popover-foreground shadow-xl animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="truncate px-4 pb-2 text-xs text-muted-foreground">
        {userName}
      </div>
      <div className="mb-1 h-px bg-border" />

      <button
        type="button"
        onClick={() => {
          onTogglePin();
          onClose();
        }}
        className={itemClass}
      >
        {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        <span>{isPinned ? "Открепить" : "Закрепить"}</span>
      </button>

      <button
        type="button"
        onClick={() => {
          window.open(chatUrl, "_blank", "noopener,noreferrer");
          onClose();
        }}
        className={itemClass}
      >
        <ExternalLink className="h-4 w-4" />
        <span>Открыть в новой вкладке</span>
      </button>

      <button type="button" onClick={copyLink} className={itemClass}>
        <Link2 className="h-4 w-4" />
        <span>Копировать ссылку</span>
      </button>
    </div>
  );
}
