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
        "transition-all duration-300 size-10 rounded flex items-center justify-center shrink-0",
        "text-slate-700 bg-slate-200 hover:bg-blue-100 hover:text-blue-600",
        "dark:text-muted-foreground dark:bg-white/5 dark:hover:bg-blue-500/15 dark:hover:text-blue-400",
        isActive &&
          "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/25",
        className
      )}
    >
      {icon}
    </button>
  );
}

export default IconButton;
