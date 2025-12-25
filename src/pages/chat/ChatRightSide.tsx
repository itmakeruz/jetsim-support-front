import { chatAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ChatHeader from "./ChatRightComponents/ChatHeader";
import ChatMessages from "./ChatRightComponents/ChatMessages";
import ChatComposer from "./ChatRightComponents/ChatComposer";
import { useState } from "react";

function ChatRightSide() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get("userId");
  const { data: singleTicketResponse, isLoading: isLoadingSingleTicket } =
    useQuery({
      queryKey: ["singleTicket", userIdFromUrl],
      queryFn: () => chatAPI.getSingleTicket(Number(userIdFromUrl)),
      enabled: !!userIdFromUrl,
    });
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
      <div
        className={`w-[320px] bg-red-500 absolute right-0 transition-all duration-300 top-0 bottom-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      ></div>
    </div>
  );
}

export default ChatRightSide;
