import type { Message } from "@/types/chat";
import type { User } from "@/types/users";
import { Download } from "lucide-react";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  user: User;
  messages: Message[];
}

type GroupedMessages = {
  date: string;
  label: string;
  items: Message[];
};

const formatDateLabel = (isoDate: string) => {
  const dateObj = new Date(isoDate);
  const today = new Date();

  const isToday =
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getDate() === today.getDate();

  if (isToday) return "Сегодня";

  return dateObj.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const groupMessages = (messages: Message[]): GroupedMessages[] => {
  const groups: Record<string, Message[]> = {};

  messages.forEach((message) => {
    if (!groups[message.date]) groups[message.date] = [];
    groups[message.date].push(message);
  });

  return Object.entries(groups)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, items]) => ({
      date,
      label: formatDateLabel(date),
      items,
    }));
};

function ChatMessages({ user, messages }: ChatMessagesProps) {
  const grouped = groupMessages(messages);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
      {grouped.map((group) => (
        <div key={group.date} className="space-y-4">
          {/* Date divider */}
          <div className="text-center relative text-[12px] text-gray-500 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-px before:w-full before:bg-gray-200">
            <span className="relative z-10 bg-white px-2 py-1 rounded-full">
              {group.label}
            </span>
          </div>

          {group.items.map((message) => {
            const isMe = message.sender === "me";

            return (
              <div
                key={message.id}
                className={`flex gap-3 items-end ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    <img
                      src={user.avatar || ""}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[50%] flex flex-col gap-2 ${
                    isMe ? "items-end" : "items-start mb-4"
                  }`}
                >
                  <div
                    className={`relative text-[14px] px-4 py-3 flex flex-col gap-2 leading-[1.4]
                    ${
                      isMe
                        ? "bg-[#f5f7fb] rounded-[4px_4px_0px_4px] text-gray-900 chat-bubble-me"
                        : "bg-main-color rounded-[4px_4px_4px_0] text-white chat-bubble-other"
                    }`}
                  >
                    {message.text}

                    {/* Attachments */}
                    {message.attachments && (
                      <div className="flex gap-2 flex-wrap">
                        {message.attachments.map((url) => {
                          const fileName = url.split("/").pop();

                          return (
                            <div
                              key={url}
                              className="relative group w-32 h-24 rounded-[2px] border overflow-hidden bg-gray-200"
                            >
                              <img
                                src={url}
                                alt="attachment"
                                className="w-full h-full object-cover"
                              />

                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <a
                                  href={url}
                                  download={fileName}
                                  className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow"
                                >
                                  <Download className="w-5 h-5 text-main-color" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <span className="text-[12px] text-gray-500 self-end">
                      {message.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* 👇 SCROLL ANCHOR */}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
