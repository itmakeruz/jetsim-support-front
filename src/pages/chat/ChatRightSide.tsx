import { chatAPI } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ChatHeader from "./ChatRightComponents/ChatHeader";
import ChatMessages from "./ChatRightComponents/ChatMessages";
import ChatComposer from "./ChatRightComponents/ChatComposer";
import { useState, useEffect, useCallback } from "react";
import type { Message } from "@/types/chat";
import {
  subscribeNewMessage,
  subscribeRemovedMessage,
  subscribeSocketConnected,
  subscribeUpdatedMessage,
  editMessage as socketEditMessage,
  deleteMessage as socketDeleteMessage,
} from "@/lib/socket";
import { showToast } from "@/utils/toastHelper";
import { cn } from "@/lib/utils";

function ChatRightSide() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get("userId");
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);
  const [editMessage, setEditMessage] = useState<Message | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Message | null>(null);
  const { data: singleTicketResponse, isLoading: isLoadingSingleTicket } =
    useQuery({
      queryKey: ["singleTicket", userIdFromUrl],
      queryFn: () => chatAPI.getSingleTicket(Number(userIdFromUrl)),
      enabled: !!userIdFromUrl,
    });

  // Xabarlarni yangilash
  useEffect(() => {
    if (singleTicketResponse?.messages) {
      setMessages(singleTicketResponse.messages);
    }
  }, [singleTicketResponse]);

  useEffect(() => {
    setMessages([]);
    setReplyMessage(null);
    setEditMessage(null);
    setDeleteConfirm(null);
  }, [userIdFromUrl]);

  // Every real-time event must name its ticket. Never attach an unscoped event
  // to whichever chat happens to be open while the operator is switching chats.
  useEffect(() => {
    if (!userIdFromUrl) return;
    const ticketId = Number(userIdFromUrl);

    const handleNewMessage = (data: unknown) => {
      const event = data as Message;
      if (event?.id && event.ticket_id === ticketId) {
        // Yangi xabarni Message formatiga o'tkazish
        const newMessage: Message = {
          ticket_id: event.ticket_id,
          id: event.id,
          is_answer: event.is_answer,
          formatted_time: event.formatted_time,
          date: event.date,
          base_url: event.base_url,
          author: event.author,
          content_type: event.content_type,
          is_ready: event.is_ready,
          message: {
            content: event.message?.content || "",
            reply_content: event.message?.reply_content,
            reply_message_id: event.message?.reply_message_id,
          },
        };

        // Xabarni ro'yxatga qo'shish (takrorlanishni oldini olish)
        setMessages((prev) => {
          // Agar bu xabar allaqachon mavjud bo'lsa, qo'shmaslik
          if (prev.some((msg) => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
      }
    };

    const handleUpdatedMessage = (data: unknown) => {
      const event = data as Message;
      if (event?.ticket_id !== ticketId) return;
      setMessages((prev) => prev.map((message) => (message.id === event.id ? { ...message, ...event } : message)));
    };

    const handleRemovedMessage = (data: unknown) => {
      const event = data as Message;
      if (event?.ticket_id !== ticketId) return;
      setMessages((prev) => prev.filter((message) => message.id !== event.id));
    };

    const unsubscribers = [
      subscribeNewMessage(handleNewMessage),
      subscribeUpdatedMessage(handleUpdatedMessage),
      subscribeRemovedMessage(handleRemovedMessage),
    ];
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [userIdFromUrl]);

  useEffect(() => subscribeSocketConnected(() => {
    queryClient.invalidateQueries({ queryKey: ["singleTicket", userIdFromUrl] });
  }), [queryClient, userIdFromUrl]);

  function togglePanel() {
    setIsOpen((prev) => !prev);
  }

  // Edit handler - xabarni tahrirlash (hozircha frontend)
  const handleEdit = useCallback((message: Message) => {
    setEditMessage(message);
    setReplyMessage(null); // Reply'ni bekor qilish
  }, []);

  // Edit submit handler
  const handleEditSubmit = useCallback(async (messageId: number, newContent: string) => {
    const result = await socketEditMessage(messageId, newContent);
    if (!result.ok) {
      showToast.error(result.error?.message || "Xabarni tahrirlab bo'lmadi");
      return false;
    }
    setMessages((prev) => prev.map((msg) =>
      msg.id === messageId ? { ...msg, message: { ...msg.message, content: newContent } } : msg
    ));
    showToast.success("Xabar tahrirlandi");
    return true;
  }, []);

  // Delete handler - xabarni o'chirish
  const handleDelete = useCallback((message: Message) => {
    setDeleteConfirm(message);
  }, []);

  // Delete confirm
  const confirmDelete = useCallback(async () => {
    if (deleteConfirm) {
      const result = await socketDeleteMessage(deleteConfirm.id);
      if (!result.ok) {
        showToast.error(result.error?.message || "Xabarni o'chirib bo'lmadi");
        return;
      }
      setMessages((prev) => prev.filter((msg) => msg.id !== deleteConfirm.id));
      showToast.success("Xabar o'chirildi");
      setDeleteConfirm(null);
    }
  }, [deleteConfirm]);

  return (
    <div className="flex overflow-hidden h-full bg-image-chat relative text-foreground">
      <div
        className={cn(
          "w-full h-full flex flex-col transition-all duration-300",
          isOpen ? "pr-[320px]" : "pr-0"
        )}
      >
        {singleTicketResponse && !isLoadingSingleTicket ? (
          <>
            <ChatHeader
              isOpen={isOpen}
              togglePanel={togglePanel}
              user={singleTicketResponse.user}
            />
            <ChatMessages
              user={singleTicketResponse.ticket}
              messages={messages}
              onReply={setReplyMessage}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <ChatComposer
              ticketId={singleTicketResponse.ticket.id}
              replyMessage={replyMessage}
              onReplyCancel={() => setReplyMessage(null)}
              editMessage={editMessage}
              onEditCancel={() => setEditMessage(null)}
              onEditSubmit={handleEditSubmit}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-center px-4">
            Выберите пользователя чтобы увидеть переписку
          </div>
        )}
      </div>
      <div
        className={cn(
          "w-[320px] absolute right-0 transition-all duration-300 top-0 bottom-0 border-l border-border bg-card text-card-foreground shadow-lg",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      />

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-popover text-popover-foreground rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-border">
            <h3 className="text-lg font-semibold mb-2">Xabarni o'chirish</h3>
            <p className="text-muted-foreground mb-4">
              Bu xabarni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
            </p>
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded mb-4 line-clamp-2">
              "{deleteConfirm.message.content}"
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-foreground bg-muted hover:bg-accent rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg transition-colors"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatRightSide;
