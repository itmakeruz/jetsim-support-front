import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChatTabs } from "./components/ChatTabs";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatComposer from "./components/ChatComposer";
import { conversationByUser, baseConversation } from "./data/conversations";
import type { Message } from "@/types/chat";
import type { User } from "@/types/users";
import { users } from "@/data";
import { chatAPI } from "@/lib/api";

function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: ticketsResponse } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => chatAPI.getTickets(),
  });
  console.log(ticketsResponse);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [selectedUserId]
  );

  const conversation = useMemo<Message[]>(() => {
    if (!selectedUserId) return [];
    return conversationByUser[selectedUserId] ?? baseConversation;
  }, [selectedUserId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedUserId !== null) {
        setSelectedUserId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedUserId]);

  return (
    <div className="h-full overflow-hidden bg-white">
      <div className="grid 2xl:grid-cols-[450px_1fr] grid-cols-[350px_1fr] h-full">
        <ChatTabs
          onUserSelect={(user: User) => setSelectedUserId(user.id)}
          selectedUserId={selectedUserId}
        />

        <div className="flex flex-col overflow-hidden h-full bg-[#F5F7FB] bg-image-chat">
          {selectedUser ? (
            <>
              <ChatHeader user={selectedUser} />
              <ChatMessages user={selectedUser} messages={conversation} />
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
