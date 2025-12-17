import sidebar from "@/constants/sidebar";
import SidebarDropdown from "./SidebarDropdown";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  openMenu: boolean;
}

export default function Sidebar({ openMenu }: SidebarProps) {
  return (
    <aside
      className={`h-[calc(100vh-48px)] no-scroll bg-[#FAFAFA] max-w-[230px] w-full shrink-0 overflow-y-auto custom-scrollbar border-r ${
        openMenu ? "hidden" : ""
      }`}
    >
      <nav className="space-y-1 p-1">
        {sidebar.map((item) =>
          item.children ? (
            <SidebarDropdown
              icon={item.icon}
              key={item.label}
              title={item.label}
              items={item.children}
            />
          ) : item.path ? (
            <SidebarItem
              isCountHas={item.isCountHas}
              key={item.path}
              icon={item.icon}
              label={item.label}
              count={5}
              path={item.path}
            />
          ) : null
        )}
      </nav>
    </aside>
  );
}
