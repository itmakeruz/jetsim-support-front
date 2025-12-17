import { useMemo, useState } from "react";
import { ChatTabs } from "./components/ChatTabs";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatComposer from "./components/ChatComposer";
import { conversationByUser, baseConversation } from "./data/conversations";
import type { Message } from "@/types/chat";
import type { User } from "@/types/users";
import { users } from "@/data";

function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [selectedUserId]
  );

  const conversation = useMemo<Message[]>(() => {
    if (!selectedUserId) return [];
    return conversationByUser[selectedUserId] ?? baseConversation;
  }, [selectedUserId]);

  return (
    <div className="h-full overflow-hidden bg-white">
      <div className="grid 2xl:grid-cols-[350px_1fr] grid-cols-[300px_1fr] h-full">
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
