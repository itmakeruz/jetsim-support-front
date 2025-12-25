import { Link, useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import adminMenu from "@/constants/sidebar";
import HeaderLogo from "./HeaderLogo";

function Header() {
  const location = useLocation();

  return (
    <div className="h-[72px] w-full flex border-b border-border-color">
      <HeaderLogo />
      <div className="flex items-center justify-between w-full px-4">
        <ul className="flex items-center gap-4">
          {adminMenu.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon as unknown as React.ComponentType;
            return (
              <Link
                key={item.path}
                className={`${
                  isActive
                    ? "text-link-color bg-link-bg hover:bg-link-bg hover:text-link-color"
                    : "text-inactive-link-color bg-inactive-link-bg hover:bg-link-bg hover:text-link-color"
                } transition-all duration-300 w-[48px] h-[48px] rounded-full flex items-center justify-center`}
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
