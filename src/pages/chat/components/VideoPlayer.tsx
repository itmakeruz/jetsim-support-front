import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  messageId: number;
  src: string;
  formattedTime: string;
  videoRefs: React.MutableRefObject<Map<number, HTMLVideoElement>>;
  onPlay: (messageId: number) => void;
  onPause: (messageId: number) => void;
  isPlaying: boolean;
}

function VideoPlayer({
  messageId,
  src,
  formattedTime,
  videoRefs,
  onPlay,
  onPause,
  isPlaying,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRefs.current.set(messageId, videoRef.current);
    }
    return () => {
      videoRefs.current.delete(messageId);
    };
  }, [messageId, videoRefs]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
  };

  const handlePlay = () => {
    onPlay(messageId);
  };

  const handlePause = () => {
    onPause(messageId);
  };

  const handleEnded = () => {
    onPause(messageId);
  };

  return (
    <div className="flex flex-col items-end relative">
      <div
        onClick={togglePlay}
        className={`shrink-0 rounded-full overflow-hidden cursor-pointer transition-all duration-300 ${
          isPlaying ? "w-[350px] h-[350px]" : "w-[250px] h-[250px]"
        }`}
      >
        <video
          ref={videoRef}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          className="w-full h-full object-cover"
          src={src}
        />
      </div>
      <span className="mt-1 text-[12px] glass-effect px-1 py-0.5 rounded-full absolute bottom-0 right-2 text-muted-foreground">
        {formattedTime?.slice(0, 5)}
      </span>
    </div>
  );
}

export default VideoPlayer;
