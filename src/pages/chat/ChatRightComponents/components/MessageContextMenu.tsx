import { useEffect, useRef } from "react";
import { Reply, Copy, Pencil, Trash2 } from "lucide-react";
import type { Message } from "@/types/chat";

interface MessageContextMenuProps {
  message: Message;
  isMe: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (message: Message) => void;
  onCopy?: () => void;
}

export default function MessageContextMenu({
  message,
  isMe,
  position,
  onClose,
  onReply,
  onEdit,
  onDelete,
  onCopy,
}: MessageContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Click tashqarisida yopish
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Scroll ni bloklash
    document.body.style.overflow = "hidden";
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("wheel", handleScroll, { passive: false });
    document.addEventListener("touchmove", handleScroll, { passive: false });

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("wheel", handleScroll);
      document.removeEventListener("touchmove", handleScroll);
    };
  }, [onClose]);

  // ESC bosilganda yopish
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Menu pozitsiyasini ekran ichida saqlash
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 180),
    y: Math.min(position.y, window.innerHeight - 200),
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {onReply && (
        <button
          onClick={() => {
            onReply(message);
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
        >
          <Reply className="w-4 h-4" />
          <span>Ответить</span>
        </button>
      )}

      {onCopy && (
        <button
          onClick={() => {
            onCopy();
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span>Копировать</span>
        </button>
      )}

      {isMe && onEdit && (
        <>
          <div className="h-px bg-gray-200 my-1" />
          <button
            onClick={() => {
              onEdit(message);
              onClose();
            }}
            className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-3 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            <span>Редактировать</span>
          </button>
        </>
      )}

      {isMe && onDelete && (
        <button
          onClick={() => {
            onDelete(message);
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Удалить</span>
        </button>
      )}
    </div>
  );
}
