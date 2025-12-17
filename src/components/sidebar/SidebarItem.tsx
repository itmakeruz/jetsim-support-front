import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

interface SidebarItemProps {
  icon: LucideIcon | IconType;
  label: string;
  path: string;
  count?: number;
  isCountHas?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  path,
  label,
  count,
  isCountHas,
}) => {
  const baseStyle =
    "flex items-center justify-between gap-[10px] relative duration-300 rounded-r transition-colors min-h-[48px] px-[14px] pr-[15px] font-medium text-[16px]";
  const activeStyle =
    "bg-[#F0F5FD] text-main-color after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-[4px] after:rounded-r-2xl after:bg-main-color";
  const inactiveStyle =
    "text-main-black hover:bg-[#F0F5FD] hover:text-main-color";

  return (
    <NavLink
      to={path}
      className={({ isActive }) => {
        return `${isActive ? activeStyle : inactiveStyle} ${baseStyle}`;
      }}
    >
      <div className="flex gap-2 items-center">
        <Icon className={`w-5 h-5 shrink-0`} />
        <span>{label}</span>
      </div>
      {isCountHas && (
        <span className="text-white text-[12px] font-medium bg-main-color rounded px-2 py-1">
          {count}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarItem;
