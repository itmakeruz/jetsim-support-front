import React from "react";
import { VideoIcon, PhotoIcon } from "@/assets/icons";
import { Paperclip } from "lucide-react";

interface LastMessagePreviewProps {
  content?: string;
}

const LastMessagePreview: React.FC<LastMessagePreviewProps> = ({
  content = "",
}) => {
  switch (content) {
    case "photo":
      return (
        <div className="flex items-center text-[13px] gap-[4px]">
          <PhotoIcon className="w-3" />
          <span className="leading-none">Фото</span>
        </div>
      );

    case "video":
    case "telegram_video":
      return (
        <div className="flex items-center text-[13px] gap-[4px]">
          <VideoIcon className="w-3" />
          <span className="leading-none">Видео</span>
        </div>
      );

    case "file":
      return (
        <div className="flex items-center text-[13px] gap-[4px]">
          <Paperclip className="w-3" />
          <span className="leading-none">Файл</span>
        </div>
      );

    default:
      return (
        <span className="truncate text-[13px] leading-none">{content}</span>
      );
  }
};

export default LastMessagePreview;
