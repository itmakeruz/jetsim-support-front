import type { Message } from "@/types/chat";
import { Reply, Copy } from "lucide-react";
import { showToast } from "@/utils/toastHelper";

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

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = message.message.content || "";
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast.success("Xabar nusxalandi");
    });
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`min-w-[200px] px-3 py-2 text-[13px] leading-[1.4] group relative cursor-pointer select-none
      ${
        isMe
          ? "bg-[#f5f7fb] rounded-[12px_12px_0px_12px] text-gray-900"
          : "bg-main-color rounded-[12px_12px_12px_0] text-white"
      }`}
    >
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1.5 z-10">
        {onReply && (
          <button
            onClick={() => onReply(message)}
            className={`p-2 rounded-full shadow-md transition-all hover:scale-110 ${
              isMe
                ? "bg-white hover:bg-gray-50 text-gray-700 shadow-gray-200"
                : "bg-white hover:bg-gray-50 text-gray-700 shadow-gray-300"
            }`}
            title="Reply"
          >
            <Reply className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleCopy}
          className={`p-2 rounded-full shadow-md transition-all hover:scale-110 ${
            isMe
              ? "bg-white hover:bg-gray-50 text-gray-700 shadow-gray-200"
              : "bg-white hover:bg-gray-50 text-gray-700 shadow-gray-300"
          }`}
          title="Copy"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
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
