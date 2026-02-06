import type { Message, Ticket } from "@/types/chat";
import { useEffect, useRef, useState, useCallback } from "react";
import DateLabel from "./components/DateLabel";
import MessageItem from "./components/MessageItem";
import ImageLightbox from "./components/ImageLightbox";
import { groupMessages } from "./utils/messageUtils";
import { useScrollAnchor } from "@/hooks/useScrollAnchor";

interface ChatMessagesProps {
  user: Ticket;
  messages: Message[];
  onReply?: (message: Message) => void;
}

function ChatMessages({ messages, user, onReply }: ChatMessagesProps) {
  const grouped = groupMessages(messages);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const lastUserIdRef = useRef<number | null>(null);

  const {
    containerRef,
    contentRef,
    scrollToBottom,
    preserveScrollPosition,
    setIsAtBottom,
  } = useScrollAnchor({ bottomThreshold: 100 });

  // Rasm yuklanganda scroll position'ni saqlash
  const handleImageLoad = useCallback(() => {
    preserveScrollPosition();
  }, [preserveScrollPosition]);

  // Lightbox ochiq bo'lganda ESC bosilganda lightboxni yopish va event propagationni to'xtatish
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxOpen) {
        e.preventDefault();
        e.stopPropagation();
        setLightboxOpen(false);
      }
    };

    // Capture fazasida event'ni ushlab olish (parent componentlardan oldin)
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [lightboxOpen]);

  // Yangi chatga kirganda to'g'ridan-to'g'ri pastga scroll qilish
  useEffect(() => {
    if (user.id !== lastUserIdRef.current) {
      // Yangi chatga kirildi - pastga scroll qilish va isAtBottom = true qilish
      lastUserIdRef.current = user.id;
      setIsAtBottom(true);
      if (messages.length > 0) {
        setTimeout(() => {
          scrollToBottom(true);
        }, 50);
      }
    }
  }, [user.id, messages.length, scrollToBottom, setIsAtBottom]);

  // Yangi xabar kelganda (faqat pastda bo'lsa scroll qilish)
  const prevMessagesLengthRef = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      // Yangi xabar keldi - faqat auto-scroll (hook o'zi hal qiladi)
      scrollToBottom(false);
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, scrollToBottom]);

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
      <div ref={contentRef}>
        {grouped.map((group) => (
          <div key={group.date} className="space-y-2 mb-6">
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
                  onReply={onReply}
                />
              );
            })}
          </div>
        ))}
      </div>

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
