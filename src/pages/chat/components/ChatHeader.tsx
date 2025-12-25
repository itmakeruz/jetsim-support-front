import type { Ticket } from "@/types/chat";
import { Info, Pin, SearchIcon } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

interface ChatHeaderProps {
  ticket: Ticket;
}

function ChatHeader({ ticket }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 h-[50px] bg-white border-b">
      <div className="flex items-center gap-3">
        <UserAvatar size="sm" name={ticket.user_name} />
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm md:text-base">
            {ticket?.user_name}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-gray-500">
        <button>
          <SearchIcon className="w-5 h-5" />
        </button>
        <button>
          <Pin className="w-5 h-5" />
        </button>
        <button>
          <Info className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
