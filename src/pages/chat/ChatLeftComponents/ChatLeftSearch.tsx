import { SearchIcon } from "@/assets/icons";

function ChatLeftSearch() {
  return (
    <form className="pb-[12px] px-[20px]">
      <div className="relative bg-inactive-link-bg rounded-full text-text-color">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Найти чат"
          className="w-full pl-10 px-4 h-[40px] font-medium rounded-md text-[14px]"
        />
      </div>
    </form>
  );
}

export default ChatLeftSearch;
