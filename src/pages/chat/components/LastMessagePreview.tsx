import React from "react";
import { VideoIcon, PhotoIcon } from "@/assets/icons";
import { FileText, Mic } from "lucide-react";

interface LastMessagePreviewProps {
  content?: string;
  contentType?: string;
}

const LastMessagePreview: React.FC<LastMessagePreviewProps> = ({
  content = "",
  contentType,
}) => {
  // content_type bo'yicha icon va matn ko'rsatish
  switch (contentType || content) {
    case "photo":
      return (
        <div className="flex items-center text-[13px] gap-[4px] text-text-color">
          <PhotoIcon className="w-3" />
          <span className="leading-none">Фото</span>
        </div>
      );

    case "video":
    case "telegram_video":
      return (
        <div className="flex items-center text-[13px] gap-[4px] text-text-color">
          <VideoIcon className="w-3" />
          <span className="leading-none">Видео</span>
        </div>
      );

    case "document":
      return (
        <div className="flex items-center text-[13px] gap-[4px] text-text-color">
          <FileText className="w-3 h-3" />
          <span className="leading-none">Документ</span>
        </div>
      );

    case "voice":
      return (
        <div className="flex items-center text-[13px] gap-[4px] text-text-color">
          <Mic className="w-3 h-3" />
          <span className="leading-none">Голосовое сообщение</span>
        </div>
      );

    case "text":
    case "reply_text":
    default:
      return (
        <span
          title={content}
          className="truncate text-[13px] text-ellipsis overflow-hidden leading-none text-text-color"
        >
          {content}
        </span>
      );
  }
};

export default LastMessagePreview;
