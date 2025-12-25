import React from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  ariaLabel?: string;
}

function IconButton({
  icon,
  onClick,
  className = "",
  isActive = false,
  ariaLabel,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "bg-inactive-link-bg hover:text-link-color hover:bg-link-bg transition-all duration-300 text-title-color w-[40px] h-[40px] rounded flex items-center justify-center",
        isActive && "bg-link-bg text-link-color",
        className
      )}
    >
      {icon}
    </button>
  );
}

export default IconButton;
