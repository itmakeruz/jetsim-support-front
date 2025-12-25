import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { exitChat } from "@/lib/socket";
import ChatLeftSide from "./ChatLeftSide";
import ChatRightSide from "./ChatRightSide";

function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get("userId");
  const selectedUserId = userIdFromUrl ? Number(userIdFromUrl) : null;

  // Exit current chat and clean URL
  const exitCurrentChat = () => {
    if (selectedUserId !== null) {
      exitChat(selectedUserId);
    }
    setSearchParams({}, { replace: true });
  };

  // ESC key to exit chat
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedUserId !== null) {
        exitCurrentChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedUserId]);

  return (
    <div className="h-full overflow-hidden">
      <div className="grid 2xl:grid-cols-[350px_1fr] md:grid-cols-[320px_1fr] h-full">
        <ChatLeftSide />
        <ChatRightSide />
      </div>
    </div>
  );
}

export default ChatPage;
