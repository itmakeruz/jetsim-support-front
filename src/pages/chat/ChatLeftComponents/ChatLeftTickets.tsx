import { chatAPI } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChatUser from "../components/ChatUser";
import ChatUserSkeleton from "../components/ChatUserSkeleton";
import { useDeferredValue, useEffect, useState, useRef } from "react";
import type { Message, NotificationTicket, Ticket } from "@/types/chat";
import { useSearchParams } from "react-router-dom";
import {
  subscribeNewMessage,
  subscribeNotification,
  subscribeSocketConnected,
} from "@/lib/socket";
import { playNotificationSound } from "@/utils/playNotificationSound";
import { showNotification } from "@/utils/notification";
import { requestPageAttention } from "@/utils/pageAttention";

interface ChatLeftTicketsProps {
  searchQuery: string;
}

function ChatLeftTickets({ searchQuery }: ChatLeftTicketsProps) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const selectedUserId = searchParams.get("userId");
  const deferredSearch = useDeferredValue(searchQuery.trim());
  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
  const lastNotificationRef = useRef<{
    ticketId: number;
    messageId?: string;
  } | null>(null);
  const { data: ticketsResponse, isLoading: isLoadingTickets } = useQuery({
    queryKey: ["tickets", deferredSearch],
    queryFn: () => chatAPI.getTickets(undefined, undefined, deferredSearch || undefined),
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
        if (!isChatOpen && findTicket && newTicket.last_message?.content) {
          // Bir xil xabar uchun takrorlanishni oldini olish
          const messageId = newTicket.last_message?.content;
          const isDuplicate =
            lastNotificationRef.current?.ticketId === newTicket.ticket_id &&
            lastNotificationRef.current?.messageId === messageId;

          if (!isDuplicate) {
            playNotificationSound();

            // Bildirishnoma chiqarish
            const messageContent =
              newTicket.last_message?.content || "Yangi xabar keldi";
            const userName = findTicket.user_name || "Yangi xabar";

            console.log(
              "Bildirishnoma chiqarishga harakat:",
              userName,
              messageContent
            );

            showNotification(userName, {
              body:
                messageContent.length > 100
                  ? messageContent.substring(0, 100) + "..."
                  : messageContent,
              tag: `ticket-${newTicket.ticket_id}`, // Bir xil ticket uchun eski bildirishnomani yangilash
              requireInteraction: false,
              silent: false,
            });

            // Oynani fokus qilish va title'ni o'zgartirish
            requestPageAttention(userName, messageContent);

            // Keyingi tekshirish uchun saqlaymiz
            lastNotificationRef.current = {
              ticketId: newTicket.ticket_id,
              messageId: messageId,
            };
          }
        }

        // ❌ YO'Q bo'lsa
        if (!findTicket) {
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
          return prev;
        }

        // Agar chat ochiq bo'lsa, push 0, aks holda push oshiriladi
        const updatedTicket: Ticket = {
          ...findTicket, // id va boshqa fieldlar saqlanadi
          last_message: {
            content: newTicket.last_message.content,
            content_type: newTicket.last_message.content_type,
          },
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

    // NewMessage event handler
    const handleNewMessage = (event: unknown) => {
      const data = event as Message;
      console.log("newMessage event data:", data);

      // Agar data ichida ticket_id va message bo'lsa
      const ticketId = data?.ticket_id;
      if (ticketId) {
        const isChatOpen = selectedUserId == ticketId.toString();

        setTicketsData((prev: Ticket[]) => {
          const findTicket = prev.find((t) => t.id === ticketId);

          // Agar chat ochiq bo'lmasa, ovoz va bildirishnoma chiqarish
          if (data.is_answer === 0 && !isChatOpen && findTicket) {
            // Bir xil xabar uchun takrorlanishni oldini olish
            const messageContent =
              data.message?.content || "Yangi xabar keldi";
            const messageId = messageContent;
            const isDuplicate =
              lastNotificationRef.current?.ticketId === ticketId &&
              lastNotificationRef.current?.messageId === messageId;

            if (!isDuplicate) {
              playNotificationSound();

              // Bildirishnoma chiqarish
              const userName = findTicket.user_name || "Yangi xabar";

              showNotification(userName, {
                body:
                  messageContent.length > 100
                    ? messageContent.substring(0, 100) + "..."
                    : messageContent,
                tag: `ticket-${ticketId}`,
                requireInteraction: false,
                silent: false,
              });

              // Oynani fokus qilish va title'ni o'zgartirish
              requestPageAttention(userName, messageContent);

              // Keyingi tekshirish uchun saqlaymiz
              lastNotificationRef.current = {
                ticketId,
                messageId: messageId,
              };
            }
          }

          // Ticket topilmasa, yangilash
          if (!findTicket) {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            return prev;
          }

          // Ticket yangilash
          const updatedTicket: Ticket = {
            ...findTicket,
            last_message: {
              content:
                data.message?.content || findTicket.last_message?.content ||
                "",
              content_type: data.content_type || findTicket.last_message?.content_type,
            },
            formatted_date: data.formatted_time || findTicket.formatted_date,
            push: isChatOpen ? 0 : (findTicket.push || 0) + 1,
          };

          // Ticketni tepaga ko'tarish
          const rest = prev.filter((t) => t.id !== findTicket?.id);
          return [updatedTicket, ...rest];
        });

        // Agar bu xabar ochiq turgan chat uchun bo'lsa, xabarlarni yangilash
        if (isChatOpen) {
          queryClient.invalidateQueries({
            queryKey: ["singleTicket", selectedUserId],
          });
        }
      }
    };

    const unsubscribeNotification = subscribeNotification(handleNotification);
    const unsubscribeNewMessage = subscribeNewMessage(handleNewMessage);
    return () => {
      unsubscribeNotification();
      unsubscribeNewMessage();
    };
  }, [selectedUserId, queryClient]);

  useEffect(() => subscribeSocketConnected(() => {
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
  }), [queryClient]);

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
