import type { Ticket } from "@/types/chat";
import type { KeyboardEvent } from "react";
import UserAvatar from "@/components/UserAvatar";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Pin } from "lucide-react";
import LastMessagePreview from "./LastMessagePreview";
import { usePinnedStore } from "@/store/pinnedStore";

interface ChatUserProps {
  ticket: Ticket;
  setTicketsData: (updater: (prev: Ticket[]) => Ticket[]) => void;
}

function ChatUser({ ticket, setTicketsData }: ChatUserProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isPinned = usePinnedStore((state) => state.pinned.includes(ticket.id));
  const userIdFromUrl = searchParams.get("userId");
  const onUserSelect = (user: Ticket) => {
    setSearchParams({ userId: user.id.toString() });
    // Tanlangan ticketning push qiymatini 0 qilish
    setTicketsData((prev: Ticket[]) => {
      return prev.map((t) => (t.id === user.id ? { ...t, push: 0 } : t));
    });
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onUserSelect(ticket);
    }
  };

  const isSelected = userIdFromUrl == ticket.id.toString();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onUserSelect(ticket)}
      onKeyDown={handleKeyDown}
      className={cn(
        "px-[20px] py-[12px] cursor-pointer transition-colors",
        "hover:bg-ticket-active-bg dark:hover:bg-white/6",
        isSelected && "bg-ticket-active-bg dark:bg-white/9"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <UserAvatar
          size="lg"
          name={ticket?.user_name || ""}
          image={`${ticket?.base_url}/${ticket?.user_image || ""}`}
        />
        <div className="flex flex-col justify-between w-full overflow-hidden">
          <div className="flex gap-2 justify-between h-[24px] items-center">
            <div
              title={ticket.user_name}
              className="text-[15px] leading-none font-medium truncate text-ellipsis overflow-hidden text-foreground"
            >
              {ticket.user_name}
            </div>
            <span className="flex shrink-0 items-center gap-1 leading-none text-[12px] whitespace-nowrap font-medium text-muted-foreground">
              {isPinned && (
                <Pin
                  className="h-3.5 w-3.5 shrink-0 fill-current text-blue-600 dark:text-blue-400"
                  aria-label="Закреплён"
                />
              )}
              {ticket.formatted_date}
            </span>
          </div>
          <div className="flex gap-1 justify-between h-[24px] items-center">
            <LastMessagePreview
              content={ticket.last_message.content}
              contentType={ticket.last_message.content_type}
            />
            {ticket.push > 0 && (
              <span className="leading-none bg-blue-600 text-white dark:bg-blue-500 text-[12px] font-medium rounded-full min-w-5 aspect-square shrink-0 flex items-center justify-center">
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
