import type { Message } from "@/types/chat";
import { Reply } from "lucide-react";

interface ReplyMessageProps {
  message: Message;
  isMe: boolean;
  onReply?: (message: Message) => void;
}

export default function ReplyMessage({
  message,
  isMe,
  onReply,
}: ReplyMessageProps) {
  const replyContent = message.message.reply_content;
  const replyText = replyContent?.content || "";

  const handleDoubleClick = () => {
    if (onReply) {
      onReply(message);
    }
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`min-w-[200px] px-3 py-2 text-[13px] leading-[1.4] group relative cursor-pointer
      ${
        isMe
          ? "bg-[#f5f7fb] rounded-[12px_12px_0px_12px] text-gray-900"
          : "bg-main-color rounded-[12px_12px_12px_0] text-white"
      }`}
    >
      {onReply && (
        <button
          onClick={() => onReply(message)}
          className={`absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full ${
            isMe
              ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
              : "bg-white/20 hover:bg-white/30 text-white"
          }`}
          title="Reply"
        >
          <Reply className="w-3.5 h-3.5" />
        </button>
      )}
      {/* Reply xabar ko'rsatish */}
      {replyContent && (
        <div
          className={`mb-2 pb-2 border-l-2 pl-2 ${
            isMe
              ? "border-gray-400 text-gray-600"
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
          isMe ? "text-gray-400" : "text-white/70"
        }`}
      >
        {message.formatted_time?.slice(0, 5)}
      </span>
    </div>
  );
}

