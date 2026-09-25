import type { User } from "@/types/chat";
import { Pin, SearchIcon, X } from "lucide-react";
import { useEffect, useRef } from "react";
import UserAvatar from "@/components/UserAvatar";
import { PanelIcon } from "@/assets/icons";
import IconButton from "@/components/buttons/IconButton";

interface ChatHeaderProps {
  user: User;
  togglePanel: () => void;
  isOpen: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  matchCount: number;
  isPinned: boolean;
  onTogglePin: () => void;
}

function ChatHeader({
  user,
  togglePanel,
  isOpen,
  searchQuery,
  onSearchChange,
  isSearchOpen,
  onToggleSearch,
  matchCount,
  isPinned,
  onTogglePin,
}: ChatHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus();
  }, [isSearchOpen]);

  return (
    <header className="flex items-center justify-between gap-3 px-6 h-[70px] shrink-0 bg-card border-b border-border">
      {isSearchOpen ? (
        <div className="flex flex-1 items-center gap-3">
          <SearchIcon className="w-5 h-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onToggleSearch()}
            placeholder="Поиск по этой переписке…"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {matchCount > 0 ? `Найдено: ${matchCount}` : "Ничего не найдено"}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <UserAvatar
            image={`${user.base_url}/${user.user_image}`}
            size="md"
            name={user.name}
          />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-xs md:text-sm text-foreground">
              {user?.name}
            </span>
          </div>
        </div>
      )}

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {!isSearchOpen && (
          <IconButton
            icon={<Pin className="w-5 h-5" />}
            ariaLabel={isPinned ? "Открепить чат" : "Закрепить чат"}
            isActive={isPinned}
            onClick={onTogglePin}
          />
        )}

        <IconButton
          icon={
            isSearchOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <SearchIcon className="w-5 h-5" />
            )
          }
          ariaLabel={isSearchOpen ? "Закрыть поиск" : "Поиск по переписке"}
          isActive={isSearchOpen}
          onClick={onToggleSearch}
        />

        {!isSearchOpen && (
          <IconButton
            icon={<PanelIcon className="w-5 h-5" />}
            onClick={togglePanel}
            isActive={isOpen}
            ariaLabel="Toggle panel"
          />
        )}
      </div>
    </header>
  );
}

export default ChatHeader;
