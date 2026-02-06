import type { Ticket } from "@/types/chat";
import type { KeyboardEvent } from "react";
import UserAvatar from "@/components/UserAvatar";
import { useSearchParams } from "react-router-dom";
import LastMessagePreview from "./LastMessagePreview";

interface ChatUserProps {
  ticket: Ticket;
  setTicketsData: (updater: (prev: Ticket[]) => Ticket[]) => void;
}

function ChatUser({ ticket, setTicketsData }: ChatUserProps) {
  const [searchParams, setSearchParams] = useSearchParams();
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

  return (
    <div
      key={ticket.id}
      role="button"
      tabIndex={0}
      aria-pressed={userIdFromUrl == ticket.id.toString()}
      onClick={() => onUserSelect(ticket)}
      onKeyDown={handleKeyDown}
      className={`px-[20px] py-[12px] hover:bg-ticket-active-bg cursor-pointer ${
        userIdFromUrl == ticket.id.toString() ? "bg-ticket-active-bg" : ""
      }`}
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
              className="text-[15px] leading-none text-black font-medium truncate text-ellipsis overflow-hidden"
            >
              {ticket.user_name}
            </div>
            <span className="leading-none text-[12px] whitespace-nowrap font-medium text-[#707991]">
              {ticket.formatted_date}
            </span>
          </div>
          <div className="flex gap-1 justify-between h-[24px] items-center">
            <LastMessagePreview
              content={ticket.last_message.content}
              contentType={ticket.last_message.content_type}
            />
            {ticket.push > 0 && (
              <span className="leading-none bg-link-color text-white text-[12px] font-medium rounded-full min-w-5 aspect-square shrink-0 flex items-center justify-center">
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
