import type { Message, Ticket } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import VoicePlayer from "./VoicePlayer";

interface ChatMessagesProps {
  user: Ticket;
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
    const dateKey = message.date.split("T")[0];
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(message);
  });

  return Object.entries(groups)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, items]) => ({
      date,
      label: formatDateLabel(date),
      items,
    }));
};

function ChatMessages({ messages }: ChatMessagesProps) {
  const grouped = groupMessages(messages);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleVideoPlay = (messageId: number) => {
    // Pause all other videos
    videoRefs.current.forEach((video, id) => {
      if (id !== messageId && video) {
        video.pause();
      }
    });
    setPlayingVideoId(messageId);
  };

  const handleVideoPause = (messageId: number) => {
    if (playingVideoId === messageId) {
      setPlayingVideoId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
      {grouped.map((group) => (
        <div key={group.date} className="space-y-2">
          {/* DATE */}
          <div className="text-center relative text-[12px] text-gray-500 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-px before:w-full before:bg-gray-200">
            <span className="relative z-10 bg-white px-2 py-1 rounded-full">
              {group.label}
            </span>
          </div>

          {group.items.map((message) => {
            const isMe = message.is_answer !== 0;

            return (
              <div
                key={message.id}
                className={`flex gap-3 items-end ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[50%] flex flex-col gap-2 ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  {/* VIDEO */}
                  {message.content_type === "video" && (
                    <VideoPlayer
                      messageId={message.id}
                      src={`${message.base_url}/${message.message.content}`}
                      formattedTime={message.formatted_time}
                      videoRefs={videoRefs}
                      onPlay={handleVideoPlay}
                      onPause={handleVideoPause}
                      isPlaying={playingVideoId === message.id}
                    />
                  )}

                  {/* VOICE */}
                  {message.content_type === "voice" && (
                    <VoicePlayer
                      src={`${message.base_url}/${message.message.content}`}
                      formattedTime={message.formatted_time}
                    />
                  )}

                  {/* PHOTO */}
                  {message.content_type === "photo" && (
                    <div className="flex flex-col items-end relative">
                      <div className="shrink-0 rounded-[12px] overflow-hidden cursor-pointer max-w-[350px]">
                        <img
                          src={`${message.base_url}/${message.message.content}`}
                          alt="Photo"
                          className="w-full h-auto object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span className="mt-1 text-[11px] text-gray-400 text-right">
                        {message.formatted_time?.slice(0, 5)}
                      </span>
                    </div>
                  )}

                  {/* TEXT */}
                  {message.content_type === "text" && (
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
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
