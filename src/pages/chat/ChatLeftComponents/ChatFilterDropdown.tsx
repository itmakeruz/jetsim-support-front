import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";

import { filterOptions } from "@/constants/filterOptions";
import type { FilterType } from "@/types/chat";

interface ChatFilterDropdownProps {
  onFilterChange?: (filter: FilterType) => void;
}

function ChatFilterDropdown({ onFilterChange }: ChatFilterDropdownProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

  const handleFilterSelect = (filter: FilterType) => {
    setSelectedFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ring-0 outline-none select-none" asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-[6px] rounded-md px-1.5 py-1 -mx-1 -my-0.5",
            "text-muted-foreground hover:text-blue-600 hover:bg-muted/70",
            "dark:hover:text-blue-400 dark:hover:bg-white/5",
            "duration-300 text-[12px] font-semibold"
          )}
        >
          <FilterIcon />
          <span>Фильтр</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-lg border-border p-1 shadow-lg"
      >
        {filterOptions.map((option) => {
          const Icon = option.icon;
          const isActive = selectedFilter === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleFilterSelect(option.value)}
              className={cn(
                "flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 data-highlighted:bg-blue-100 data-highlighted:text-blue-600 dark:data-highlighted:bg-blue-500/30 dark:data-highlighted:text-blue-400 [&_svg]:text-blue-600 dark:[&_svg]:text-blue-400"
                  : "text-foreground"
              )}
            >
              <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
                <Icon />
              </span>
              <span>{option.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ChatFilterDropdown;
