import { useEffect, useRef } from "react";
import type { Message } from "@/types/chat";

interface SimpleVideoPlayerProps {
  message: Message;
  videoRefs: React.MutableRefObject<Map<number, HTMLVideoElement>>;
  playingVideoId: number | null;
  onVideoPlay: (messageId: number) => void;
  onVideoPause: (messageId: number) => void;
}

export default function SimpleVideoPlayer({
  message,
  videoRefs,
  playingVideoId,
  onVideoPlay,
  onVideoPause,
}: SimpleVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRefs.current.set(message.id, videoRef.current);
    }
    return () => {
      videoRefs.current.delete(message.id);
    };
  }, [message.id, videoRefs]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    const isPlaying = playingVideoId === message.id;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handlePlay = () => {
    onVideoPlay(message.id);
  };

  const handlePause = () => {
    onVideoPause(message.id);
  };

  const handleEnded = () => {
    onVideoPause(message.id);
  };

  return (
    <div className="flex flex-col items-end relative">
      <div
        onClick={togglePlay}
        className="shrink-0 rounded-[12px] overflow-hidden cursor-pointer max-w-[350px]"
      >
        <video
          ref={videoRef}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          controls
          className="w-full h-auto object-cover"
          src={`${message.base_url}/${message.message.content}`}
        />
      </div>
      <span className="mt-1 text-[11px] text-gray-400 text-right">
        {message.formatted_time?.slice(0, 5)}
      </span>
    </div>
  );
}
