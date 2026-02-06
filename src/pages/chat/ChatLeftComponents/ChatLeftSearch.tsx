import { SearchIcon } from "@/assets/icons";

interface ChatLeftSearchProps {
  value: string;
  onChange: (value: string) => void;
}

function ChatLeftSearch({ value, onChange }: ChatLeftSearchProps) {
  return (
    <form className="pb-[12px] px-[20px]" onSubmit={(e) => e.preventDefault()}>
      <div className="relative bg-inactive-link-bg rounded-full text-text-color">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Найти чат"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 px-4 h-[40px] font-medium rounded-md text-[14px]"
        />
      </div>
    </form>
  );
}

export default ChatLeftSearch;
