import type { Ticket } from "@/types/chat";
import { Info, Pin, SearchIcon } from "lucide-react";

interface ChatHeaderProps {
  ticket: Ticket;
}

function ChatHeader({ ticket }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-2 bg-white border-b">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 text-base font-bold rounded-full bg-main-color text-white overflow-hidden flex items-center justify-center">
          {ticket.user_name.charAt(0)}
        </div>
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
