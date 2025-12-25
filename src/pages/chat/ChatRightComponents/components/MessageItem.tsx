import type { Message } from "@/types/chat";
import VideoPlayer from "@/pages/chat/components/VideoPlayer";
import VoicePlayer from "@/pages/chat/components/VoicePlayer";
import PhotoMessage from "./PhotoMessage";
import TextMessage from "./TextMessage";
import SimpleVideoPlayer from "./SimpleVideoPlayer";

interface MessageItemProps {
  message: Message;
  isMe: boolean;
  videoRefs: React.MutableRefObject<Map<number, HTMLVideoElement>>;
  playingVideoId: number | null;
  onVideoPlay: (messageId: number) => void;
  onVideoPause: (messageId: number) => void;
  onImageClick: (message: Message) => void;
  onImageLoad: () => void;
}

export default function MessageItem({
  message,
  isMe,
  videoRefs,
  playingVideoId,
  onVideoPlay,
  onVideoPause,
  onImageClick,
  onImageLoad,
}: MessageItemProps) {
  return (
    <div
      className={`flex gap-3 items-end ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[50%] flex flex-col gap-2 ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        {message.content_type === "video" && (
          <SimpleVideoPlayer
            message={message}
            videoRefs={videoRefs}
            playingVideoId={playingVideoId}
            onVideoPlay={onVideoPlay}
            onVideoPause={onVideoPause}
          />
        )}

        {message.content_type === "telegram_video" && (
          <VideoPlayer
            messageId={message.id}
            src={`${message.base_url}/${message.message.content}`}
            formattedTime={message.formatted_time}
            videoRefs={videoRefs}
            onPlay={onVideoPlay}
            onPause={onVideoPause}
            isPlaying={playingVideoId === message.id}
          />
        )}

        {message.content_type === "voice" && (
          <VoicePlayer
            src={`${message.base_url}/${message.message.content}`}
            formattedTime={message.formatted_time}
          />
        )}

        {message.content_type === "photo" && (
          <PhotoMessage
            message={message}
            onImageClick={onImageClick}
            onImageLoad={onImageLoad}
          />
        )}

        {message.content_type === "text" && (
          <TextMessage message={message} isMe={isMe} />
        )}
      </div>
    </div>
  );
}
