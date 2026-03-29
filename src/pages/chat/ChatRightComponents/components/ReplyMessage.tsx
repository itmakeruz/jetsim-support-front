import { useState } from "react";
import type { Message } from "@/types/chat";
import { Reply } from "lucide-react";
import { showToast } from "@/utils/toastHelper";
import MessageContextMenu from "./MessageContextMenu";

interface ReplyMessageProps {
  message: Message;
  isMe: boolean;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (message: Message) => void;
}

export default function ReplyMessage({
  message,
  isMe,
  onReply,
  onEdit,
  onDelete,
}: ReplyMessageProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const replyContent = message.message.reply_content;
  const replyText = replyContent?.content || "";

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
        {/* Reply xabar ko'rsatish */}
        {replyContent && (
          <div
            className={`mb-2 pb-2 border-l-2 pl-2 ${
              isMe
                ? "border-gray-400 dark:border-muted-foreground/40 text-gray-600 dark:text-muted-foreground"
                : "border-white/50 text-white/80"
            }`}
          >
            <div className="flex items-center gap-1 mb-1">
              <Reply className="w-3 h-3" />
              <span className="text-[11px] font-medium">Reply</span>
            </div>
            <p className="text-[12px] line-clamp-2">{replyText}</p>
          </div>
        )}

        {/* Asosiy xabar matni */}
        <p className="whitespace-pre-wrap wrap-break-word">
          {message.message.content}
        </p>
        <span
          className={`block mt-1 text-[11px] text-right ${
            isMe
              ? "text-gray-400 dark:text-muted-foreground"
              : "text-white/70"
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
