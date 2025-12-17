import type { User } from "@/types/users";
import type { KeyboardEvent } from "react";

interface ChatUserProps {
  user: User;
  isActive?: boolean;
  onSelect?: (user: User) => void;
}

function ChatUser({ user, isActive, onSelect }: ChatUserProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(user);
    }
  };

  return (
    <div
      key={user.id}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={() => onSelect?.(user)}
      onKeyDown={handleKeyDown}
      className={`min-h-[60px] hover:bg-gray-100 cursor-pointer px-2 py-3 ${
        isActive ? "bg-[#E9F1FF]" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={user.avatar || ""}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm leading-none font-medium">{user.name}</div>
            <div className="text-sm text-gray-500 leading-[1.3] font-normal line-clamp-1">
              {user.lastMessage}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="leading-none text-xs">{user.lastMessageTime}</span>
          {user.unreadMessages > 0 && (
            <span className="leading-none bg-[#27AE60] p-1 text-white text-[10px] font-medium rounded-full min-w-4 aspect-square shrink-0 flex items-center justify-center">
              {user.unreadMessages}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatUser;
