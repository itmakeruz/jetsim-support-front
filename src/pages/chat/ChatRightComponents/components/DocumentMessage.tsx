import { useState } from "react";
import type { Message } from "@/types/chat";
import { FileText, Download } from "lucide-react";
import MessageContextMenu from "./MessageContextMenu";

interface DocumentMessageProps {
  message: Message;
  isMe: boolean;
  onReply?: (message: Message) => void;
}

// Fayl kengaytmasidan icon rangini aniqlash
const getFileColor = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const colors: Record<string, string> = {
    pdf: "text-red-500",
    doc: "text-blue-600",
    docx: "text-blue-600",
    xls: "text-green-600",
    xlsx: "text-green-600",
    ppt: "text-orange-500",
    pptx: "text-orange-500",
    zip: "text-yellow-600",
    rar: "text-yellow-600",
    txt: "text-gray-600",
  };
  return colors[ext] || "text-gray-500";
};

// Fayl nomini olish
const getFileName = (path: string): string => {
  return path.split("/").pop() || "Document";
};

export default function DocumentMessage({
  message,
  isMe,
  onReply,
}: DocumentMessageProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const fileUrl = `${message.base_url}/${message.message.content}`;
  const fileName = getFileName(message.message.content);
  const fileColor = getFileColor(fileName);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDownload = () => {
    window.open(fileUrl, "_blank");
  };

  return (
    <>
      <div
        onClick={handleDownload}
        onContextMenu={handleContextMenu}
        className={`min-w-[250px] max-w-[300px] px-3 py-3 rounded-xl cursor-pointer transition-all hover:opacity-90 group
        ${
          isMe
            ? "bg-[#f5f7fb] dark:bg-muted rounded-br-none"
            : "bg-main-color rounded-bl-none"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* File icon */}
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isMe ? "bg-white dark:bg-card" : "bg-white/20"
            }`}
          >
            <FileText className={`w-5 h-5 ${isMe ? fileColor : "text-white"}`} />
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium truncate ${
                isMe ? "text-gray-900 dark:text-foreground" : "text-white"
              }`}
            >
              {fileName}
            </p>
            <p
              className={`text-xs ${
                isMe ? "text-gray-500 dark:text-muted-foreground" : "text-white/70"
              }`}
            >
              Документ
            </p>
          </div>

          {/* Download icon */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
              isMe ? "bg-gray-100 dark:bg-muted" : "bg-white/20"
            }`}
          >
            <Download
              className={`w-4 h-4 ${
                isMe ? "text-gray-600 dark:text-muted-foreground" : "text-white"
              }`}
            />
          </div>
        </div>

        {/* Time */}
        <div className="flex justify-end mt-2">
          <span
            className={`text-[11px] ${
              isMe ? "text-gray-400 dark:text-muted-foreground" : "text-white/70"
            }`}
          >
            {message.formatted_time?.slice(0, 5)}
          </span>
        </div>
      </div>

      {contextMenu && (
        <MessageContextMenu
          message={message}
          isMe={isMe}
          position={contextMenu}
          onClose={() => setContextMenu(null)}
          onReply={onReply}
        />
      )}
    </>
  );
}
