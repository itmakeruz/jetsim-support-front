import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { users } from "@/data";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import ChatUser from "./ChatUser";
import type { User } from "@/types/users";

interface ChatTabsProps {
  onUserSelect?: (user: User) => void;
  selectedUserId?: number | null;
}

interface TabConfig {
  value: string;
  label: string;
  filterFn: (users: User[]) => User[];
}

const tabConfigs: TabConfig[] = [
  {
    value: "all",
    label: "Все",
    filterFn: (chats) => chats,
  },
  {
    value: "new",
    label: "Новые",
    filterFn: (chats) => chats.filter((chat) => chat.type === "new"),
  },
  {
    value: "my-chats",
    label: "Мои чаты",
    filterFn: (chats) => chats.filter((chat) => chat.type === "assigned"),
  },
  {
    value: "closed",
    label: "Закрытые",
    filterFn: (chats) => chats.filter((chat) => chat.type === "closed"),
  },
];

export function ChatTabs({ onUserSelect, selectedUserId }: ChatTabsProps) {
  const [activeTab, setActiveTab] = useState("all");

  const renderUser = (user: User) => (
    <ChatUser
      key={user.id}
      user={user}
      isActive={selectedUserId === user.id}
      onSelect={onUserSelect}
    />
  );

  const getIndicatorPosition = () => {
    const activeIndex = tabConfigs.findIndex((tab) => tab.value === activeTab);
    return activeIndex >= 0 ? activeIndex * 100 : 0;
  };

  const filteredUsers = (tabValue: string) => {
    const tabConfig = tabConfigs.find((tab) => tab.value === tabValue);
    return tabConfig ? tabConfig.filterFn(users) : [];
  };

  return (
    <Tabs
      className="border-r gap-0 h-full overflow-hidden"
      onValueChange={(value: string) => setActiveTab(value)}
      defaultValue="all"
    >
      <TabsList className="w-full bg-white relative rounded-none min-h-[48px]">
        {tabConfigs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            className={`bg-transparent! shadow-none! font-semibold ${
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
            {filteredUsers(tab.value).map((user: User) => renderUser(user))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
