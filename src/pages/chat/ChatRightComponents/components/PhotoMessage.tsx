import type { Message } from "@/types/chat";
import LazyImage from "@/components/LazyImage";
import { Reply } from "lucide-react";

interface PhotoMessageProps {
  message: Message;
  onImageClick: (message: Message) => void;
  onImageLoad: () => void;
  onReply?: (message: Message) => void;
}

export default function PhotoMessage({
  message,
  onImageClick,
  onImageLoad,
  onReply,
}: PhotoMessageProps) {
  const handleDoubleClick = () => {
    if (onReply) {
      onReply(message);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    // Double-click bo'lmasa, lightbox ochish
    if (e.detail === 1) {
      onImageClick(message);
    }
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="flex flex-col items-end relative group"
    >
      {onReply && (
        <button
          onClick={() => onReply(message)}
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-700 z-10"
          title="Reply"
        >
          <Reply className="w-3.5 h-3.5" />
        </button>
      )}
      <div
        className="shrink-0 rounded-[12px] overflow-hidden cursor-pointer max-w-[350px]"
        onClick={handleImageClick}
      >
        <LazyImage
          src={`${message.base_url}/${message.message.content}`}
          alt="Photo"
          className="w-full h-auto object-cover"
          effect="blur"
          threshold={100}
          onLoad={onImageLoad}
        />
      </div>
      <span className="mt-1 text-[11px] text-gray-400 text-right">
        {message.formatted_time?.slice(0, 5)}
      </span>
    </div>
  );
}
