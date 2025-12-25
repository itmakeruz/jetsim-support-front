import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "@/assets/icons";

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
        <button className="flex items-center gap-[6px] text-text-color hover:text-link-color duration-300 text-[12px] font-semibold">
          <FilterIcon />
          <span>Фильтр</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white rounded-lg space-y-1 shadow-lg border overflow-hidden"
      >
        {filterOptions.map((option) => {
          const Icon = option.icon;
          const isActive = selectedFilter === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleFilterSelect(option.value)}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                isActive
                  ? "text-link-color bg-link-bg"
                  : "text-inactive-link-color hover:bg-link-bg! hover:text-link-color!"
              }`}
            >
              <Icon />
              <span className="text-sm">{option.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ChatFilterDropdown;
