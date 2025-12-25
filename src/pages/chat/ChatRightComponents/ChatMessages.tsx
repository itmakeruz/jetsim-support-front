import type { Message, Ticket } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import DateLabel from "./components/DateLabel";
import MessageItem from "./components/MessageItem";
import ImageLightbox from "./components/ImageLightbox";
import { groupMessages } from "./utils/messageUtils";

interface ChatMessagesProps {
  user: Ticket;
  messages: Message[];
}

function ChatMessages({ messages }: ChatMessagesProps) {
  const grouped = groupMessages(messages);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageLoad = () => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handleImageClick = (message: Message) => {
    const photoMessages = messages.filter(
      (msg) => msg.content_type === "photo"
    );
    const index = photoMessages.findIndex((msg) => msg.id === message.id);
    if (index !== -1) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  const handleVideoPlay = (messageId: number) => {
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
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6"
    >
      {grouped.map((group) => (
        <div key={group.date} className="space-y-2">
          <DateLabel label={group.label} />

          {group.items.map((message) => {
            const isMe = message.is_answer !== 0;

            return (
              <MessageItem
                key={message.id}
                message={message}
                isMe={isMe}
                videoRefs={videoRefs}
                playingVideoId={playingVideoId}
                onVideoPlay={handleVideoPlay}
                onVideoPause={handleVideoPause}
                onImageClick={handleImageClick}
                onImageLoad={handleImageLoad}
              />
            );
          })}
        </div>
      ))}

      <div ref={bottomRef} />

      <ImageLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        index={lightboxIndex}
        messages={messages}
      />
    </div>
  );
}

export default ChatMessages;
