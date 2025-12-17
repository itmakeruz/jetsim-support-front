import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useLocation } from "react-router-dom";
import type { IconType } from "react-icons";
import type { MenuItem } from "@/constants/sidebar";

interface SidebarDropdownProps {
  icon: LucideIcon | IconType;
  title: string;
  items: MenuItem[];
}

export default function SidebarDropdown({
  icon: Icon,
  items,
  title,
}: SidebarDropdownProps) {
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const isMatch = items.some(
      (item) => item.path && location.pathname.includes(item.path)
    );
    if (isMatch) {
      setOpen(true);
    }
  }, [location.pathname, items]);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-main-black hover:bg-gray-100 rounded px-[14px] min-h-[48px] pr-[15px] font-medium text-[16px]"
      >
        <div className="flex items-center text-start gap-[10px]">
          <Icon className="w-5 h-5 shrink-0" />
          <span>{title}</span>
        </div>
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {open && (
        <ul className="pl-[10px]">
          {items.map(
            (item) =>
              item.path && (
                <SidebarItem
                  count={5}
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                />
              )
          )}
        </ul>
      )}
    </div>
  );
}
