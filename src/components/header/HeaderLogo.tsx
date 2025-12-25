import { logoIcon } from "@/assets/images";
import { Link } from "react-router-dom";

function HeaderLogo() {
  return (
    <Link
      className="border-r border-border-color shrink-0 h-full flex items-center justify-center"
      to="/"
    >
      <img
        src={logoIcon}
        alt="logo"
        className="w-[80%] h-[80%] object-contain"
      />
    </Link>
  );
}
export default HeaderLogo;
