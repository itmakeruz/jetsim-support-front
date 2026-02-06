import { useState } from "react";
import ChatLeftFilter from "./ChatLeftComponents/ChatLeftFilter";
import ChatLeftSearch from "./ChatLeftComponents/ChatLeftSearch";
import ChatLeftTickets from "./ChatLeftComponents/ChatLeftTickets";

function ChatLeftSide() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="border-r border-border-color h-full overflow-hidden flex flex-col">
      <div>
        <ChatLeftFilter />
        <ChatLeftSearch value={searchQuery} onChange={setSearchQuery} />
      </div>
      <ChatLeftTickets searchQuery={searchQuery} />
    </div>
  );
}

export default ChatLeftSide;
