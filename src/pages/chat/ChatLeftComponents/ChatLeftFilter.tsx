import { ReloadIcon } from "@/assets/icons";
import ChatFilterDropdown from "./ChatFilterDropdown";

function ChatLeftFilter() {
  return (
    <div className="flex items-center justify-between px-[20px] py-[20px]">
      <h2 className="md:text-[20px] font-semibold text-title-color">Чаты</h2>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-[6px] text-text-color hover:text-link-color duration-300 text-[12px] font-semibold">
          <ReloadIcon />
          <span>Обновить</span>
        </button>
        <ChatFilterDropdown />
      </div>
    </div>
  );
}

export default ChatLeftFilter;
