import type { Ticket } from "@/types/chat";
import type { KeyboardEvent } from "react";
import UserAvatar from "@/components/UserAvatar";

interface ChatUserProps {
  ticket: Ticket;
  isActive?: boolean;
  onSelect?: (ticket: Ticket) => void;
}

function ChatUser({ ticket, isActive, onSelect }: ChatUserProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(ticket);
    }
  };

  return (
    <div
      key={ticket.id}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={() => onSelect?.(ticket)}
      onKeyDown={handleKeyDown}
      className={`min-h-[60px] hover:bg-gray-100 cursor-pointer px-2 py-3 ${
        isActive ? "bg-[#F5F5F5]" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <UserAvatar size="lg" name={ticket?.user_name || ""} />
        <div className="flex flex-col justify-between w-full">
          <div className="flex gap-1 justify-between h-[24px] items-center">
            <div className="text-[15px] leading-none font-medium">
              {ticket.user_name}
            </div>
            <span className="leading-none text-[13px] font-medium text-[#707991]">
              {ticket.formatted_date}
            </span>
          </div>
          <div className="flex gap-1 justify-between h-[24px] items-center">
            <div
              title={ticket.last_message.content}
              className="text-sm text-[#707991] max-w-[180px] leading-[1.3] font-normal line-clamp-1"
            >
              {ticket.last_message.content}
            </div>
            {ticket.push > 0 && (
              <span className="leading-none bg-[#78E378] text-white text-[14px] font-medium rounded-full min-w-5 aspect-square shrink-0 flex items-center justify-center">
                {ticket.push > 9 ? "9+" : ticket.push}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatUser;
