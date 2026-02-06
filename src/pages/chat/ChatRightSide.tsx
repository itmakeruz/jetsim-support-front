import { chatAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ChatHeader from "./ChatRightComponents/ChatHeader";
import ChatMessages from "./ChatRightComponents/ChatMessages";
import ChatComposer from "./ChatRightComponents/ChatComposer";
import { useState, useEffect, useCallback } from "react";
import type { Message } from "@/types/chat";
import { setNewMessageCallback, removeNewMessageCallback } from "@/lib/socket";
import { showToast } from "@/utils/toastHelper";

function ChatRightSide() {
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

  // newMessage event'ini listen qilish
  useEffect(() => {
    if (!userIdFromUrl) return;

    const handleNewMessage = (data: any) => {
      // Agar ticket_id bo'lsa, tekshiramiz, aks holda hozirgi ochiq chat uchun deb faraz qilamiz
      const isForCurrentChat = data.ticket_id
        ? userIdFromUrl === data.ticket_id.toString()
        : true; // ticket_id bo'lmasa, hozirgi chat uchun deb faraz qilamiz

      if (data && data.id && isForCurrentChat) {
        // Yangi xabarni Message formatiga o'tkazish
        const newMessage: Message = {
          id: data.id,
          is_answer: data.is_answer,
          formatted_time: data.formatted_time,
          date: data.date,
          base_url: data.base_url,
          author: data.author,
          content_type: data.content_type,
          is_ready: data.is_ready,
          message: {
            content: data.message?.content || "",
            reply_content: data.message?.reply_content,
            reply_message_id: data.message?.reply_message_id,
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

    setNewMessageCallback(handleNewMessage);

    return () => {
      removeNewMessageCallback();
    };
  }, [userIdFromUrl]);

  function togglePanel() {
    setIsOpen((prev) => !prev);
  }

  // Edit handler - xabarni tahrirlash (hozircha frontend)
  const handleEdit = useCallback((message: Message) => {
    setEditMessage(message);
    setReplyMessage(null); // Reply'ni bekor qilish
  }, []);

  // Edit submit handler
  const handleEditSubmit = useCallback((messageId: number, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, message: { ...msg.message, content: newContent } }
          : msg
      )
    );
    showToast.success("Xabar tahrirlandi");
    // TODO: API ulanganda bu yerda API chaqirish kerak
  }, []);

  // Delete handler - xabarni o'chirish (hozircha frontend)
  const handleDelete = useCallback((message: Message) => {
    setDeleteConfirm(message);
  }, []);

  // Delete confirm
  const confirmDelete = useCallback(() => {
    if (deleteConfirm) {
      setMessages((prev) => prev.filter((msg) => msg.id !== deleteConfirm.id));
      showToast.success("Xabar o'chirildi");
      setDeleteConfirm(null);
      // TODO: API ulanganda bu yerda API chaqirish kerak
    }
  }, [deleteConfirm]);

  return (
    <div className="flex overflow-hidden h-full bg-[#F5F7FB] bg-image-chat relative">
      <div
        className={`w-full h-full flex flex-col transition-all duration-300 ${
          isOpen ? "pr-[320px]" : "pr-0"
        }`}
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
              messages={
                messages.length > 0
                  ? messages
                  : singleTicketResponse.messages ?? []
              }
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
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Выберите пользователя чтобы увидеть переписку
          </div>
        )}
      </div>
      <div
        className={`w-[320px] bg-red-500 absolute right-0 transition-all duration-300 top-0 bottom-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      ></div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xabarni o'chirish
            </h3>
            <p className="text-gray-600 mb-4">
              Bu xabarni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
            </p>
            <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded mb-4 line-clamp-2">
              "{deleteConfirm.message.content}"
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
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
