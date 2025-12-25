interface VoicePlayerProps {
  src: string;
  formattedTime: string;
}

function VoicePlayer({ src, formattedTime }: VoicePlayerProps) {
  return (
    <div className="flex flex-col items-end w-[300px]">
      <audio controls className="w-full" src={src} />
      <span className="mt-1 text-[12px] text-gray-400">
        {formattedTime.slice(0, 5)}
      </span>
    </div>
  );
}

export default VoicePlayer;
