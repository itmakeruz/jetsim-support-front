import { chatAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ChatHeader from "./ChatRightComponents/ChatHeader";
import ChatMessages from "./ChatRightComponents/ChatMessages";
import ChatComposer from "./ChatRightComponents/ChatComposer";
import { useState, useEffect } from "react";
import type { Message } from "@/types/chat";
import { setNewMessageCallback, removeNewMessageCallback } from "@/lib/socket";

function ChatRightSide() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get("userId");
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);
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
            />
            <ChatComposer
              ticketId={singleTicketResponse.ticket.id}
              replyMessage={replyMessage}
              onReplyCancel={() => setReplyMessage(null)}
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
    </div>
  );
}

export default ChatRightSide;
