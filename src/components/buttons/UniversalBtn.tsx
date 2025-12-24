import { Loader2, type LucideIcon } from "lucide-react";
import React from "react";

interface UniversalBtnProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

function UniversalBtn({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "left",
}: UniversalBtnProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`bg-main-color rounded h-[38px] px-[24px] flex items-center gap-[5px] text-white font-medium text-base leading-[1]
       ${className}`}
    >
      {loading && <Loader2 className="animate-spin w-4 h-4" />}
      {!loading && Icon && iconPosition === "left" && (
        <Icon className="w-5 h-5" />
      )}
      {children}
      {!loading && Icon && iconPosition === "right" && (
        <Icon className="w-5 h-5" />
      )}
    </button>
  );
}

export default UniversalBtn;
