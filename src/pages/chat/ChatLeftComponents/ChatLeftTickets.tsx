import { chatAPI } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChatUser from "../components/ChatUser";
import ChatUserSkeleton from "../components/ChatUserSkeleton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Message, NotificationTicket, Ticket } from "@/types/chat";
import { useSearchParams } from "react-router-dom";
import {
  subscribeNewMessage,
  subscribeNotification,
  subscribeSocketConnected,
  subscribeTicketUpdated,
} from "@/lib/socket";
import { playNotificationSound } from "@/utils/playNotificationSound";
import { showNotification } from "@/utils/notification";
import { requestPageAttention } from "@/utils/pageAttention";

interface ChatLeftTicketsProps {
  searchQuery: string;
}

interface TicketsResponse {
  tickets: Ticket[];
}

/** Список подтягивается сокетом; интервал — страховка на случай пропущенного события */
const BACKGROUND_REFRESH_MS = 5 * 60 * 1000;

/** Поиск по тексту сообщений идёт регуляркой по всей таблице — не дёргаем его на каждое нажатие */
const SEARCH_DEBOUNCE_MS = 400;

function ChatLeftTickets({ searchQuery }: ChatLeftTicketsProps) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const selectedUserId = searchParams.get("userId");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery.trim());
  const lastNotificationRef = useRef<{
    ticketId: number;
    messageId?: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchQuery.trim()),
      SEARCH_DEBOUNCE_MS
    );
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const queryKey = useMemo(() => ["tickets", debouncedSearch], [debouncedSearch]);

  const { data: ticketsResponse, isLoading: isLoadingTickets } = useQuery({
    queryKey,
    queryFn: () =>
      chatAPI.getTickets(undefined, undefined, debouncedSearch || undefined),
    refetchInterval: BACKGROUND_REFRESH_MS,
  });

  const ticketsData = ticketsResponse?.tickets ?? [];

  /**
   * Пишем прямо в кэш react-query вместо локального useState.
   * Раньше список жил в useState-зеркале: react-query при рефетче возвращает
   * ту же ссылку (structural sharing), эффект не срабатывал, и испорченное
   * состояние чинилось только перезагрузкой страницы.
   */
  const updateTickets = useCallback(
    (updater: (prev: Ticket[]) => Ticket[]) => {
      queryClient.setQueryData<TicketsResponse>(queryKey, (old) =>
        old ? { ...old, tickets: updater(old.tickets ?? []) } : old
      );
    },
    [queryClient, queryKey]
  );

  const readTickets = useCallback(
    () => queryClient.getQueryData<TicketsResponse>(queryKey)?.tickets ?? [],
    [queryClient, queryKey]
  );

  /** Звук, системное уведомление и мигание вкладкой — побочные эффекты, им не место в апдейтере состояния */
  const notifyAboutMessage = useCallback(
    (ticketId: number, userName: string, content: string) => {
      const isDuplicate =
        lastNotificationRef.current?.ticketId === ticketId &&
        lastNotificationRef.current?.messageId === content;

      if (isDuplicate) return;

      playNotificationSound();
      showNotification(userName, {
        body: content.length > 100 ? `${content.substring(0, 100)}...` : content,
        tag: `ticket-${ticketId}`,
        requireInteraction: false,
        silent: false,
      });
      requestPageAttention(userName, content);

      lastNotificationRef.current = { ticketId, messageId: content };
    },
    []
  );

  const moveTicketToTop = useCallback(
    (
      ticketId: number,
      patch: Pick<Ticket, "last_message" | "formatted_date" | "push">
    ) => {
      updateTickets((prev) => {
        const target = prev.find((ticket) => ticket.id === ticketId);
        if (!target) return prev;

        const updated: Ticket = { ...target, ...patch };
        return [updated, ...prev.filter((ticket) => ticket.id !== ticketId)];
      });
    },
    [updateTickets]
  );

  useEffect(() => {
    const handleNotification = (newTicket: NotificationTicket) => {
      const ticketId = newTicket.ticket_id;
      const isChatOpen = selectedUserId == ticketId.toString();
      const existing = readTickets().find((ticket) => ticket.id === ticketId);

      if (!existing) {
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
        return;
      }

      const content = newTicket.last_message?.content;
      if (!isChatOpen && content) {
        notifyAboutMessage(ticketId, existing.user_name || "Новое сообщение", content);
      }

      moveTicketToTop(ticketId, {
        last_message: {
          content: newTicket.last_message.content,
          content_type: newTicket.last_message.content_type,
        },
        formatted_date: newTicket.date,
        push: isChatOpen ? 0 : (existing.push || 0) + 1,
      });

      if (isChatOpen) {
        queryClient.invalidateQueries({
          queryKey: ["singleTicket", selectedUserId],
        });
      }
    };

    const handleNewMessage = (event: unknown) => {
      const data = event as Message;
      const ticketId = data?.ticket_id;
      if (!ticketId) return;

      const isChatOpen = selectedUserId == ticketId.toString();
      const existing = readTickets().find((ticket) => ticket.id === ticketId);

      if (!existing) {
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
        return;
      }

      if (data.is_answer === 0 && !isChatOpen) {
        notifyAboutMessage(
          ticketId,
          existing.user_name || "Новое сообщение",
          data.message?.content || "Новое сообщение"
        );
      }

      moveTicketToTop(ticketId, {
        last_message: {
          content: data.message?.content || existing.last_message?.content || "",
          content_type: data.content_type || existing.last_message?.content_type,
        },
        formatted_date: data.formatted_time || existing.formatted_date,
        push: isChatOpen ? 0 : (existing.push || 0) + 1,
      });

      if (isChatOpen) {
        queryClient.invalidateQueries({
          queryKey: ["singleTicket", selectedUserId],
        });
      }
    };

    // Полезной нагрузки этих событий достаточно не всегда, поэтому просто перезапрашиваем список
    const handleTicketUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    };

    const unsubscribeNotification = subscribeNotification(handleNotification);
    const unsubscribeNewMessage = subscribeNewMessage(handleNewMessage);
    const unsubscribeTicketUpdated = subscribeTicketUpdated(handleTicketUpdated);

    return () => {
      unsubscribeNotification();
      unsubscribeNewMessage();
      unsubscribeTicketUpdated();
    };
  }, [
    selectedUserId,
    queryClient,
    readTickets,
    moveTicketToTop,
    notifyAboutMessage,
  ]);

  useEffect(
    () =>
      subscribeSocketConnected(() => {
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      }),
    [queryClient]
  );

  return (
    <div className="custom-scrollbar overflow-y-auto h-full">
      {isLoadingTickets
        ? Array.from({ length: 6 }).map((_, index) => (
            <ChatUserSkeleton key={index} />
          ))
        : ticketsData.map((ticket) => (
            <ChatUser
              setTicketsData={updateTickets}
              key={ticket.id}
              ticket={ticket}
            />
          ))}
    </div>
  );
}

export default ChatLeftTickets;
