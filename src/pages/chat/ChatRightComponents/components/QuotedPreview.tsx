import { Reply } from "lucide-react";
import { showToast } from "@/utils/toastHelper";
import type { Message } from "@/types/chat";

interface QuotedPreviewProps {
  message: Message;
  isMe: boolean;
}

const HIGHLIGHT_MS = 2000;

export default function QuotedPreview({ message, isMe }: QuotedPreviewProps) {
  const replyContent = message.message.reply_content;
  const replyMessageId = message.message.reply_message_id;

  if (!replyContent) return null;

  const scrollToOriginal = (e: React.MouseEvent) => {
    // Двойной клик по пузырю — это ответ; переход по цитате не должен его задевать
    e.stopPropagation();

    if (!replyMessageId) return;

    const target = document.querySelector<HTMLElement>(
      `[data-message-id="${replyMessageId}"]`
    );

    if (!target) {
      showToast.error("Исходное сообщение не загружено — прокрутите переписку выше");
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("message-highlight");
    window.setTimeout(
      () => target.classList.remove("message-highlight"),
      HIGHLIGHT_MS
    );
  };

  return (
    <button
      type="button"
      onClick={scrollToOriginal}
      title="Перейти к исходному сообщению"
      className={`w-full text-left mb-2 pb-2 border-l-2 pl-2 transition-opacity hover:opacity-80 ${
        isMe
          ? "border-gray-400 dark:border-muted-foreground/40 text-gray-600 dark:text-muted-foreground"
          : "border-white/50 text-white/80"
      }`}
    >
      <div className="flex items-center gap-1 mb-1">
        <Reply className="w-3 h-3" />
        <span className="text-[11px] font-medium">
          {replyContent.author || "Ответ"}
        </span>
      </div>
      <p className="text-[12px] line-clamp-2">{replyContent.content || ""}</p>
    </button>
  );
}
