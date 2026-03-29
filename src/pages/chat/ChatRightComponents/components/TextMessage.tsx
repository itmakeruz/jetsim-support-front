import { useState } from "react";
import type { Message } from "@/types/chat";
import { showToast } from "@/utils/toastHelper";
import MessageContextMenu from "./MessageContextMenu";

interface TextMessageProps {
  message: Message;
  isMe: boolean;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (message: Message) => void;
}

export default function TextMessage({
  message,
  isMe,
  onReply,
  onEdit,
  onDelete,
}: TextMessageProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDoubleClick = () => {
    if (onReply) {
      onReply(message);
    }
  };

  const handleCopy = () => {
    const textToCopy = message.message.content || "";
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast.success("Xabar nusxalandi");
    });
  };

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        className={`min-w-[200px] px-3 py-2 text-[13px] leading-[1.4] relative cursor-pointer select-none
        ${
          isMe
            ? "bg-[#f5f7fb] dark:bg-muted rounded-[12px_12px_0px_12px] text-gray-900 dark:text-foreground"
            : "bg-main-color rounded-[12px_12px_12px_0] text-white"
        }`}
      >
        <p className="whitespace-pre-wrap wrap-break-word">
          {message.message.content}
        </p>
        <span
          className={`block mt-1 text-[11px] text-right ${
            isMe ? "text-gray-400 dark:text-muted-foreground" : "text-white/70"
          }`}
        >
          {message.formatted_time?.slice(0, 5)}
        </span>
      </div>

      {contextMenu && (
        <MessageContextMenu
          message={message}
          isMe={isMe}
          position={contextMenu}
          onClose={() => setContextMenu(null)}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopy={handleCopy}
        />
      )}
    </>
  );
}
