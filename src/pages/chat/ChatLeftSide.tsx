import ChatLeftFilter from "./ChatLeftComponents/ChatLeftFilter";
import ChatLeftSearch from "./ChatLeftComponents/ChatLeftSearch";
import ChatLeftTickets from "./ChatLeftComponents/ChatLeftTickets";

function ChatLeftSide() {
  return (
    <div className="border-r border-border-color h-full overflow-hidden flex flex-col">
      <div>
        <ChatLeftFilter />
        <ChatLeftSearch />
      </div>
      <ChatLeftTickets />
    </div>
  );
}

export default ChatLeftSide;
