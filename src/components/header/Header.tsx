import { Link, useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import adminMenu from "@/constants/sidebar";
import HeaderLogo from "./HeaderLogo";
import { cn } from "@/lib/utils";

function Header() {
  const location = useLocation();

  return (
    <div className="h-[72px] w-full flex border-b border-border bg-background">
      <HeaderLogo />
      <div className="flex items-center justify-between w-full px-4">
        <ul className="flex items-center gap-4">
          {adminMenu.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon as unknown as React.ComponentType;
            return (
              <Link
                key={item.path}
                className={cn(
                  "transition-all duration-300 size-12 rounded-full flex items-center justify-center",
                  isActive
                    ? "text-blue-600 bg-blue-100 hover:bg-blue-100 hover:text-blue-600 dark:text-blue-400 dark:bg-blue-500/20 dark:hover:bg-blue-500/25 dark:hover:text-blue-400"
                    : "text-slate-700 bg-slate-200 hover:bg-blue-100 hover:text-blue-600 dark:text-muted-foreground dark:bg-white/5 dark:hover:bg-blue-500/15 dark:hover:text-blue-400"
                )}
                to={item.path || "/"}
              >
                <Icon />
              </Link>
            );
          })}
        </ul>
        <ul className="flex items-center gap-4">
          <ProfileButton />
        </ul>
      </div>
    </div>
  );
}

export default Header;
