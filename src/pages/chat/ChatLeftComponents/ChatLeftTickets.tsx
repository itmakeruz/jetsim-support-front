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
import { playNotificationSound } from "@/utils/playNotificationSound";
import { showNotification } from "@/utils/notification";

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
      const isChatOpen = selectedUserId == newTicket.ticket_id.toString();

      setTicketsData((prev: Ticket[]) => {
        const findTicket = prev.find((t) => t.id === newTicket.ticket_id);

        // Agar chat ochiq bo'lmasa, ovoz va bildirishnoma chiqarish
        if (!isChatOpen && findTicket) {
          playNotificationSound();

          // Bildirishnoma chiqarish
          showNotification(findTicket.user_name || "Yangi xabar", {
            body: newTicket.last_message?.content || "Yangi xabar keldi",
            tag: `ticket-${newTicket.ticket_id}`, // Bir xil ticket uchun eski bildirishnomani yangilash
            requireInteraction: false,
            silent: false,
          });
        }

        // ❌ YO'Q bo'lsa
        if (!findTicket) {
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
          return prev;
        }

        // Agar chat ochiq bo'lsa, push 0, aks holda push oshiriladi
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
      if (isChatOpen) {
        queryClient.invalidateQueries({
          queryKey: ["singleTicket", selectedUserId],
        });
      }
    };

    setNotificationCallback(handleNotification);

    return () => {
      removeNotificationCallback();
    };
  }, [selectedUserId, queryClient]);

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
