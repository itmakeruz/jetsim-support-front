import type { Message } from "@/types/chat";
import LazyImage from "@/components/LazyImage";

interface PhotoMessageProps {
  message: Message;
  onImageClick: (message: Message) => void;
  onImageLoad: () => void;
}

export default function PhotoMessage({
  message,
  onImageClick,
  onImageLoad,
}: PhotoMessageProps) {
  return (
    <div className="flex flex-col items-end relative">
      <div
        className="shrink-0 rounded-[12px] overflow-hidden cursor-pointer max-w-[350px]"
        onClick={() => onImageClick(message)}
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
