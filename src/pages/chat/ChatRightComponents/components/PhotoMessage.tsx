import { useState } from "react";
import type { Message } from "@/types/chat";
import LazyImage from "@/components/LazyImage";
import MessageContextMenu from "./MessageContextMenu";

interface PhotoMessageProps {
  message: Message;
  onImageClick: (message: Message) => void;
  onImageLoad?: () => void;
  onReply?: (message: Message) => void;
}

export default function PhotoMessage({
  message,
  onImageClick,
  onImageLoad,
  onReply,
}: PhotoMessageProps) {
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

  const handleImageClick = (e: React.MouseEvent) => {
    // Double-click bo'lmasa, lightbox ochish
    if (e.detail === 1) {
      onImageClick(message);
    }
  };

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        className="flex flex-col items-end relative group"
      >
        <div
          className="shrink-0 rounded-[12px] relative flex border border-border overflow-hidden cursor-pointer max-w-[300px]"
          onClick={handleImageClick}
        >
          <LazyImage
            src={`${message.base_url}/${message.message.content}`}
            alt="Photo"
            className="w-full h-full object-cover"
            effect="blur"
            threshold={100}
            onLoad={onImageLoad}
          />
          <div className="image-skeleton z-[-1]"></div>
        </div>
        <span className="text-[11px] group-hover:opacity-100 transition-opacity opacity-0 absolute bottom-1 right-2 bg-popover border border-border drop-shadow-md px-2 py-1 rounded-full text-muted-foreground leading-none">
          {message.formatted_time?.slice(0, 5)}
        </span>
      </div>

      {contextMenu && (
        <MessageContextMenu
          message={message}
          isMe={true}
          position={contextMenu}
          onClose={() => setContextMenu(null)}
          onReply={onReply}
        />
      )}
    </>
  );
}
