import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
import type { Ticket } from "@/types/chat";

function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get("userId");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    userIdFromUrl ? Number(userIdFromUrl) : null
  );
  const [updatedTickets, setUpdatedTickets] = useState<Ticket[]>([]);
  const isUpdatingFromUser = useRef(false);

  const { data: ticketsResponse, isLoading: isLoadingTickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => chatAPI.getTickets(),
  });
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
    const handleNotification = (newTicket: Ticket) => {
      setUpdatedTickets((prevTickets) => {
        const existingIndex = prevTickets.findIndex(
          (t) => t.user_id === newTicket.user_id
        );

        if (existingIndex >= 0) {
          // Update existing ticket (merge push count and last message, but keep original id)
          const updated = [...prevTickets];
          updated[existingIndex] = {
            ...updated[existingIndex],
            last_message: newTicket.last_message,
            push: newTicket.push,
            formatted_date: newTicket.formatted_date,
            is_online: newTicket.is_online,
            // Keep the original id from API ticket
          };
          return updated;
        } else {
          // Add new ticket to the beginning of the list
          return [newTicket, ...prevTickets];
        }
      });
    };

    // Set the notification callback
    setNotificationCallback(handleNotification);

    // Cleanup on unmount
    return () => {
      removeNotificationCallback();
    };
  }, []);

  // Merge API tickets with updated tickets from socket
  const tickets = useMemo(() => {
    const apiTickets = ticketsResponse?.tickets || [];

    if (updatedTickets.length === 0) {
      return apiTickets;
    }

    // Create a map of updated tickets by user_id
    const updatedMap = new Map(
      updatedTickets.map((ticket) => [ticket.user_id, ticket])
    );

    // Merge: use updated ticket if exists, otherwise use API ticket
    const mergedTickets = apiTickets.map((apiTicket) => {
      const updatedTicket = updatedMap.get(apiTicket.user_id);
      if (updatedTicket) {
        // Merge: keep API ticket's id and other fields, but update from socket
        const merged: Ticket = {
          ...apiTicket, // Keep all API ticket fields (including correct id)
          last_message: updatedTicket.last_message,
          push: updatedTicket.push,
          formatted_date: updatedTicket.formatted_date,
          is_online: updatedTicket.is_online,
        };
        // Remove from map so we know it's been merged
        updatedMap.delete(apiTicket.user_id);
        return merged;
      }
      return apiTicket;
    });

    // Add any new tickets that weren't in the API response
    const newTickets = Array.from(updatedMap.values());
    return [...newTickets, ...mergedTickets];
  }, [ticketsResponse?.tickets, updatedTickets]);

  if (isLoadingTickets) {
    return <Loader isFullScreen={true} />;
  }

  return (
    <div className="h-full overflow-hidden bg-white">
      <div className="grid 2xl:grid-cols-[420px_1fr] xl:grid-cols-[380px_1fr] lg:grid-cols-[350px_1fr] h-full">
        <ChatTabs
          tickets={tickets!}
          onUserSelect={(user: Ticket) => {
            isUpdatingFromUser.current = true;
            setSelectedUserId(user.id);
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
