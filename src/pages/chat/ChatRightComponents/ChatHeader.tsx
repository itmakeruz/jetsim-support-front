import type { User } from "@/types/chat";
import { Pin, SearchIcon } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { PanelIcon } from "@/assets/icons";
import IconButton from "@/components/buttons/IconButton";

interface ChatHeaderProps {
  user: User;
  togglePanel: () => void;
  isOpen: boolean;
}

function ChatHeader({ user, togglePanel, isOpen }: ChatHeaderProps) {
  const handleSearch = () => {
    // Chrome'dagi search funksiyasini ochish
    // Ctrl+F yoki Cmd+F tugmalarini bosish
    try {
      // window.find() API'sini ishlatish (Chrome, Firefox, Safari)
      if (typeof (window as any).find === "function") {
        (window as any).find();
        return;
      }
    } catch (error) {
      console.log("window.find() not available");
    }

    // Fallback: Keyboard event'ini trigger qilish
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const event = new KeyboardEvent("keydown", {
      key: "f",
      code: "KeyF",
      ctrlKey: !isMac,
      metaKey: isMac,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  };
  return (
    <header className="flex items-center justify-between px-6 h-[70px] bg-white border-b">
      <div className="flex items-center gap-3">
        <UserAvatar
          image={`${user.base_url}/${user.user_image}`}
          size="md"
          name={user.name}
        />
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xs md:text-sm">{user?.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-gray-500">
        <IconButton icon={<Pin className="w-5 h-5" />} ariaLabel="Pin" />
        <IconButton
          icon={<SearchIcon className="w-5 h-5" />}
          ariaLabel="Search"
          onClick={handleSearch}
        />
        <IconButton
          icon={<PanelIcon className="w-5 h-5" />}
          onClick={togglePanel}
          isActive={isOpen}
          ariaLabel="Toggle panel"
        />
      </div>
    </header>
  );
}

export default ChatHeader;
