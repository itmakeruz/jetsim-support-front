import { SearchIcon } from "@/assets/icons";

interface ChatLeftSearchProps {
  value: string;
  onChange: (value: string) => void;
}

function ChatLeftSearch({ value, onChange }: ChatLeftSearchProps) {
  return (
    <form className="pb-[12px] px-[20px]" onSubmit={(e) => e.preventDefault()}>
      <div className="relative rounded-full bg-muted border border-border">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Найти чат"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 h-10 font-medium rounded-full text-sm bg-transparent text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-0"
        />
      </div>
    </form>
  );
}

export default ChatLeftSearch;
