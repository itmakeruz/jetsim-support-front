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

  return (
    <Tabs
      className="border-r gap-0 h-full overflow-hidden"
      onValueChange={(value: string) => setActiveTab(value)}
      defaultValue="all"
    >
      <TabsList
        className={`w-full bg-white relative rounded-none min-h-[48px]`}
      >
        <TabsTrigger
          className={`bg-transparent! shadow-none! font-semibold ${
            activeTab == "all" ? "" : "text-main-color"
          }`}
          value="all"
        >
          Все
        </TabsTrigger>
        <TabsTrigger
          className={`bg-transparent! shadow-none! font-semibold ${
            activeTab == "new" ? "text-main-color" : ""
          }`}
          value="new"
        >
          Новые
        </TabsTrigger>
        <TabsTrigger
          className={`bg-transparent! shadow-none! font-semibold ${
            activeTab == "saved" ? "text-main-color" : ""
          }`}
          value="saved"
        >
          Избранные
        </TabsTrigger>
        <div
          className={`absolute left-0 z-1 w-[calc(100%/3)] bottom-0 h-1 bg-main-color rounded-r-2xl transition-all duration-300 translate-x-0 ${
            activeTab === "all"
              ? "translate-x-0"
              : activeTab === "new"
              ? "translate-x-full"
              : "translate-x-[200%]"
          }`}
        ></div>
        <div
          className={`absolute left-0 z-0 w-full bottom-0 h-1 bg-gray-300`}
        ></div>
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

      <TabsContent value="all" className="h-full overflow-hidden">
        <div className="custom-scrollbar overflow-y-auto h-full">
          {users.map((user: User) => renderUser(user))}
        </div>
      </TabsContent>
      <TabsContent value="new">
        <div className="custom-scrollbar overflow-y-auto h-full">
          {users
            .filter((user: User) => user.type === activeTab)
            .map((user: User) => renderUser(user))}
        </div>
      </TabsContent>
      <TabsContent value="saved">
        <div className="custom-scrollbar overflow-y-auto h-full">
          {users
            .filter((user: User) => user.saved)
            .map((user: User) => renderUser(user))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
