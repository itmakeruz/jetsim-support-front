function ChatUserSkeleton() {
  return (
    <div className="px-[20px] py-[12px]">
      <div className="flex items-center justify-between gap-3">
        {/* Avatar skeleton */}
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse shrink-0" />

        <div className="flex flex-col justify-between w-full gap-2">
          {/* First row: name and date */}
          <div className="flex gap-1 justify-between h-[24px] items-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
          </div>

          {/* Second row: message preview */}
          <div className="flex gap-1 justify-between h-[24px] items-center">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatUserSkeleton;
