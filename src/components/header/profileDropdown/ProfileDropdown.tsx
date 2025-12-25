import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Moon, User, Settings, Lock, Power } from "lucide-react";
import { useState } from "react";

interface ProfileDropdownProps {
  onClose?: () => void;
}

function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState<"on" | "off">("off");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    onClose?.();
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg border overflow-hidden">
      {/* User Info Section */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
            <img
              src={
                user?.photo ||
                "https://connectme-html.themeyn.com/images/avatar/3.jpg"
              }
              alt={user?.name || "User"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-sm text-gray-900 truncate">
                {user?.name || "User"}
              </h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="#2563eb"
                className="shrink-0"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {user?.login || "Status"}
            </p>
          </div>
        </div>
      </div>

      {/* Darkmode Section */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <Moon className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Darkmode</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="darkmode"
              value="on"
              checked={darkMode === "on"}
              onChange={() => setDarkMode("on")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">On</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="darkmode"
              value="off"
              checked={darkMode === "off"}
              onChange={() => setDarkMode("off")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Off</span>
          </label>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-2">
        <button
          onClick={() => {
            navigate("/profile");
            onClose?.();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
        <button
          onClick={() => {
            navigate("/settings");
            onClose?.();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => {
            navigate("/change-password");
            onClose?.();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Lock className="w-4 h-4" />
          <span>Change Password</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <Power className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileDropdown;
