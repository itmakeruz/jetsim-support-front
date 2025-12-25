import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import ChatUser from "./ChatUser";
import type { Ticket } from "@/types/chat";

interface ChatTabsProps {
  onUserSelect?: (user: Ticket) => void;
  selectedUserId?: number | null;
  tickets: Ticket[];
}

interface TabConfig {
  value: string;
  label: string;
}

const tabConfigs: TabConfig[] = [
  {
    value: "all",
    label: "Все",
  },
  {
    value: "new",
    label: "Новые",
  },
  {
    value: "my-chats",
    label: "Мои чаты",
  },
  {
    value: "closed",
    label: "Закрытые",
  },
];

export function ChatTabs({
  onUserSelect,
  selectedUserId,
  tickets,
}: ChatTabsProps) {
  const [activeTab, setActiveTab] = useState("all");

  const renderUser = (ticket: Ticket) => (
    <ChatUser
      key={ticket.id}
      ticket={ticket}
      isActive={selectedUserId === ticket.id}
      onSelect={onUserSelect}
    />
  );

  const getIndicatorPosition = () => {
    const activeIndex = tabConfigs.findIndex((tab) => tab.value === activeTab);
    return activeIndex >= 0 ? activeIndex * 100 : 0;
  };

  return (
    <Tabs
      className="border-r gap-0 h-full overflow-hidden"
      onValueChange={(value: string) => setActiveTab(value)}
      defaultValue="all"
    >
      <TabsList className="w-full bg-white relative rounded-none min-h-[50px]">
        {tabConfigs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            className={`bg-transparent! shadow-none! text-[12px] xl:text-[14px] font-semibold ${
              activeTab === tab.value ? "" : "text-main-color"
            }`}
            value={tab.value}
          >
            {tab.label}
          </TabsTrigger>
        ))}
        <div
          className="absolute left-0 z-1 bottom-0 h-1 bg-main-color rounded-r-2xl transition-all duration-300"
          style={{
            width: `calc(100% / ${tabConfigs.length})`,
            transform: `translateX(${getIndicatorPosition()}%)`,
          }}
        ></div>
        <div className="absolute left-0 z-0 w-full bottom-0 h-1 bg-gray-300"></div>
      </TabsList>
      <form className="bg-[#F0F5FD] relative text-main-color flex items-center justify-between text-base font-medium">
        <input
          type="text"
          placeholder="Поиск"
          className="bg-transparent outline-none p-2 flex-1 min-h-[36px]"
        />
        <button type="submit" className="absolute right-2">
          <SearchIcon className="w-4 h-4" />
        </button>
      </form>

      {tabConfigs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="h-full overflow-hidden"
        >
          <div className="custom-scrollbar overflow-y-auto h-full">
            {tickets.map((user: Ticket) => renderUser(user))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
