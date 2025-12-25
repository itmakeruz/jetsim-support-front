import { chatAPI } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChatUser from "../components/ChatUser";
import ChatUserSkeleton from "../components/ChatUserSkeleton";
import { useEffect, useState } from "react";
import type { NotificationTicket, Ticket } from "@/types/chat";
import { useSearchParams } from "react-router-dom";
import {
  removeNotificationCallback,
  setNotificationCallback,
} from "@/lib/socket";

function ChatLeftTickets() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const selectedUserId = searchParams.get("userId");
  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
  const { data: ticketsResponse, isLoading: isLoadingTickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => chatAPI.getTickets(),
  });
  useEffect(() => {
    if (ticketsResponse?.tickets) {
      setTicketsData(ticketsResponse.tickets);
    }
  }, [ticketsResponse]);
  useEffect(() => {
    const handleNotification = (newTicket: NotificationTicket) => {
      setTicketsData((prev: Ticket[]) => {
        const findTicket = prev.find((t) => t.id === newTicket.ticket_id);

        // ❌ YO'Q bo'lsa
        if (!findTicket) {
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
          return prev;
        }

        // Agar chat ochiq bo'lsa, push 0, aks holda push oshiriladi
        const isChatOpen = selectedUserId == newTicket.ticket_id.toString();
        const updatedTicket: Ticket = {
          ...findTicket, // id va boshqa fieldlar saqlanadi
          last_message: { content: newTicket.last_message.content },
          formatted_date: newTicket.date,
          push: isChatOpen ? 0 : (findTicket.push || 0) + 1,
        };

        // eski joyidan olib tashlab, tepaga qo'yamiz
        const rest = prev.filter((t) => t.id !== findTicket?.id);
        return [updatedTicket, ...rest];
      });

      // Agar bu xabar ochiq turgan chat uchun bo'lsa, xabarlarni yangilash
      if (selectedUserId == newTicket.ticket_id.toString()) {
        queryClient.invalidateQueries({
          queryKey: ["singleTicket", selectedUserId],
        });
      }
    };

    setNotificationCallback(handleNotification);

    return () => {
      removeNotificationCallback();
    };
  }, [ticketsResponse?.tickets, selectedUserId]);

  return (
    <div className="custom-scrollbar overflow-y-auto h-full">
      {isLoadingTickets
        ? Array.from({ length: 6 }).map((_, index) => (
            <ChatUserSkeleton key={index} />
          ))
        : ticketsData.map((ticket) => {
            return (
              <ChatUser
                setTicketsData={setTicketsData}
                key={ticket.id}
                ticket={ticket}
              />
            );
          })}
    </div>
  );
}

export default ChatLeftTickets;
