import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ChatTabs } from "./components/ChatTabs";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatComposer from "./components/ChatComposer";
import { chatAPI } from "@/lib/api";
import Loader from "@/components/loader/Loader";
import {
  exitChat,
  setNotificationCallback,
  removeNotificationCallback,
} from "@/lib/socket";
import type { NotificationTicket, Ticket } from "@/types/chat";

function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get("userId");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    userIdFromUrl ? Number(userIdFromUrl) : null
  );
  const queryClient = useQueryClient();
  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
  const isUpdatingFromUser = useRef(false);

  const { data: ticketsResponse, isLoading: isLoadingTickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => chatAPI.getTickets(),
  });

  // ticketsResponse o'zgarganda ticketsData ni yangilash
  useEffect(() => {
    if (ticketsResponse?.tickets) {
      setTicketsData(ticketsResponse.tickets);
    }
  }, [ticketsResponse]);

  const { data: singleTicketResponse, isLoading: isLoadingSingleTicket } =
    useQuery({
      queryKey: ["singleTicket", selectedUserId],
      queryFn: () => chatAPI.getSingleTicket(selectedUserId),
      enabled: !!selectedUserId,
    });

  // Update URL when selectedUserId changes (from user action)
  useEffect(() => {
    if (isUpdatingFromUser.current) {
      if (selectedUserId !== null) {
        const currentUrlUserId = searchParams.get("userId");
        if (currentUrlUserId !== selectedUserId.toString()) {
          setSearchParams(
            { userId: selectedUserId.toString() },
            { replace: true }
          );
        }
      } else {
        const currentUrlUserId = searchParams.get("userId");
        if (currentUrlUserId !== null) {
          setSearchParams({}, { replace: true });
        }
      }
      isUpdatingFromUser.current = false;
    }
  }, [selectedUserId, searchParams, setSearchParams]);

  // Sync with URL changes (e.g., browser back/forward, direct link)
  useEffect(() => {
    const urlUserId = searchParams.get("userId");
    if (urlUserId) {
      const userId = Number(urlUserId);
      if (!isNaN(userId) && userId !== selectedUserId) {
        // Exit previous chat if switching to a new one
        if (selectedUserId !== null) {
          exitChat(selectedUserId);
        }
        isUpdatingFromUser.current = false;
        setSelectedUserId(userId);
      }
    } else if (selectedUserId !== null && !isUpdatingFromUser.current) {
      // Exit chat when deselecting
      exitChat(selectedUserId);
      setSelectedUserId(null);
    }
  }, [searchParams, selectedUserId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedUserId !== null) {
        exitChat(selectedUserId);
        isUpdatingFromUser.current = true;
        setSelectedUserId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedUserId]);

  // Exit chat when component unmounts
  useEffect(() => {
    return () => {
      if (selectedUserId !== null) {
        exitChat(selectedUserId);
      }
    };
  }, [selectedUserId]);

  // Handle socket notifications - update chat list
  useEffect(() => {
    const handleNotification = (newTicket: NotificationTicket) => {
      setTicketsData((prev: Ticket[]) => {
        const findTicket = prev.find((t) => t.id === newTicket.ticket_id);

        // ❌ YO'Q bo'lsa
        if (!findTicket) {
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
          return prev;
        }

        const updatedTicket: Ticket = {
          ...findTicket, // id va boshqa fieldlar saqlanadi
          last_message: { content: newTicket.last_message.content },
          formatted_date: newTicket.date,
          push: (findTicket.push || 0) + 1,
        };

        // eski joyidan olib tashlab, tepaga qo'yamiz
        const rest = prev.filter((t) => t.id !== findTicket?.id);
        return [updatedTicket, ...rest];
      });

      // Agar bu xabar ochiq turgan chat uchun bo'lsa, xabarlarni yangilash
      if (selectedUserId === newTicket.ticket_id) {
        queryClient.invalidateQueries({
          queryKey: ["singleTicket", selectedUserId],
        });
      }
    };

    setNotificationCallback(handleNotification);

    return () => {
      removeNotificationCallback();
    };
  }, [ticketsResponse?.tickets, selectedUserId, queryClient]);

  if (isLoadingTickets) {
    return <Loader isFullScreen={true} />;
  }

  return (
    <div className="h-full overflow-hidden bg-white">
      <div className="grid 2xl:grid-cols-[420px_1fr] xl:grid-cols-[380px_1fr] lg:grid-cols-[350px_1fr] h-full">
        <ChatTabs
          tickets={ticketsData!}
          onUserSelect={(user: Ticket) => {
            isUpdatingFromUser.current = true;
            setSelectedUserId(user.id);
            setTicketsData((prev: Ticket[]) => {
              const index = prev.findIndex((t) => t.id === user.id);
              if (index === -1) return prev;

              return prev.map((ticket, i) =>
                i === index ? { ...ticket, push: 0 } : ticket
              );
            });
          }}
          selectedUserId={selectedUserId}
        />

        <div className="flex flex-col overflow-hidden h-full bg-[#F5F7FB] bg-image-chat">
          {singleTicketResponse && !isLoadingSingleTicket ? (
            <>
              <ChatHeader ticket={singleTicketResponse.ticket} />
              <ChatMessages
                user={singleTicketResponse.ticket}
                messages={singleTicketResponse.messages ?? []}
              />
              <ChatComposer />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Выберите пользователя чтобы увидеть переписку
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
