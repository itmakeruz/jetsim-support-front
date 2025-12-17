import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, ChevronDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";

export default function ProfileDropdown() {
  const name = "Elshod Jurabekov";
  const { logout } = useAuthStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex select-none items-center gap-[10px] outline-none">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src="https://s3-alpha-sig.figma.com/img/2649/d4c7/dab521f6cd5545aa07040c074c97ef51?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=avmps1l7MStBwVIsSQzljUbqJQ46nLEQUDRddnASHnreT0q-Jq3qjblFJwf-CWBkkhQRn~2w7FsxE8c9FzfI4F7stFBV0c4cnFum1sKUsuB1UH7EDBxkSrZ4MuMvi1x7O8xbksx9bcaJQ-TEj92cElHMD~hqJ556Sr5fnJBZRvPewKNcCjqkbEN2mTloNMxhaQIfoD9~OCqhdXkRRxQF0WZ15p7rZo9k0VEcQDgOUUZMlKOtzbpohm9jSNIcvx7W6sRA-euZ7GqEF1Xr6IqvxmxbB256Omrq7NKS~OjUGjngfh0ZFyWLMMK~uP20oL8o-~aiLk9t9szhOtWmvippKg__"
            alt="Avatar"
          />
          <AvatarFallback className="text-sm uppercase">
            {name
              .split(" ")
              .map((item) => item[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-main-black font-medium capitalize">
          {name}
        </span>
        <ChevronDown className="w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-2 mt-2 space-y-2 main-shadow">
        <DropdownMenuItem>
          <Link to={`/`} className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Мой профиль
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <Link to={`/`} className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Блокировать
          </Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem className="">
          <button onClick={() => logout()} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
