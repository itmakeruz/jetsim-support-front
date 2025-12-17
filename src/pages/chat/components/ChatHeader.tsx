import type { User } from "@/types/users";
import { Info, Pin, SearchIcon } from "lucide-react";

interface ChatHeaderProps {
  user: User;
}

function ChatHeader({ user }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-2 bg-white border-b">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200">
          <img
            src={user.avatar || ""}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm md:text-base">
            {user.name}
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
