import type { Message } from "@/types/chat";

interface TextMessageProps {
  message: Message;
  isMe: boolean;
}

export default function TextMessage({ message, isMe }: TextMessageProps) {
  return (
    <div
      className={`min-w-[200px] px-3 py-2 text-[13px] leading-[1.4]
      ${
        isMe
          ? "bg-[#f5f7fb] rounded-[12px_12px_0px_12px] text-gray-900"
          : "bg-main-color rounded-[12px_12px_12px_0] text-white"
      }`}
    >
      <p className="whitespace-pre-wrap wrap-break-word">
        {message.message.content}
      </p>
      <span className="block mt-1 text-[11px] text-gray-400 text-right">
        {message.formatted_time?.slice(0, 5)}
      </span>
    </div>
  );
}
