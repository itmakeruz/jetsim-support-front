import { ReloadIcon } from "@/assets/icons";
import ChatFilterDropdown from "./ChatFilterDropdown";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";

function ChatLeftFilter() {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: ["tickets"] });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
  };

  return (
    <div className="flex items-center justify-between px-[20px] py-[20px]">
      <h2 className="md:text-[20px] font-semibold text-foreground">Чаты</h2>
      <div className="flex items-center gap-3">
        <button
          onClick={handleRefresh}
          disabled={isFetching > 0}
          className="flex items-center gap-[6px] text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 duration-300 text-[12px] font-semibold disabled:opacity-50"
        >
          <span className={isFetching > 0 ? "animate-spin" : ""}>
            <ReloadIcon />
          </span>
          <span>Обновить</span>
        </button>
        <ChatFilterDropdown />
      </div>
    </div>
  );
}

export default ChatLeftFilter;
