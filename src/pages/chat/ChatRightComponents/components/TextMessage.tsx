import type { Message } from "@/types/chat";
import { Reply, Copy } from "lucide-react";
import { showToast } from "@/utils/toastHelper";

interface TextMessageProps {
  message: Message;
  isMe: boolean;
  onReply?: (message: Message) => void;
}

export default function TextMessage({
  message,
  isMe,
  onReply,
}: TextMessageProps) {
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
      <p className="whitespace-pre-wrap wrap-break-word">
        {message.message.content}
      </p>
      <span className="block mt-1 text-[11px] text-gray-400 text-right">
        {message.formatted_time?.slice(0, 5)}
      </span>
    </div>
  );
}
