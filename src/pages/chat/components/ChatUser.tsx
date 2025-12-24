import type { Ticket } from "@/types/chat";
import type { KeyboardEvent } from "react";

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
        isActive ? "bg-[#E9F1FF]" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 text-base font-bold rounded-full bg-main-color text-white overflow-hidden flex items-center justify-center">
            {ticket.user_name.charAt(0)}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm leading-none font-medium">
              {ticket.user_name}
            </div>
            <div className="text-sm text-gray-500 leading-[1.3] font-normal line-clamp-1">
              {ticket.last_message.content}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="leading-none text-xs">{ticket.formatted_date}</span>
          {ticket.push > 0 && (
            <span className="leading-none bg-[#27AE60] p-1 text-white text-[10px] font-medium rounded-full min-w-4 aspect-square shrink-0 flex items-center justify-center">
              {ticket.push}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatUser;
