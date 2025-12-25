import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import ProfileDropdown from "./profileDropdown/ProfileDropdown";

function ProfileButton() {
  const { user } = useAuthStore();
  const defaultProfileImage =
    user?.photo || "https://connectme-html.themeyn.com/images/avatar/3.jpg";
  const displayProfileImage = defaultProfileImage;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`w-[48px] h-[48px] rounded-full overflow-hidden cursor-pointer`}
      >
        <img
          className="w-full h-full object-cover"
          src={displayProfileImage}
          alt="Profile"
        />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 z-50">
          <ProfileDropdown onClose={() => setIsDropdownOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default ProfileButton;
