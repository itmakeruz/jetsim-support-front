interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
};

export default function UserAvatar({
  name,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const initial = name?.charAt(0)?.toUpperCase() || "";

  return (
    <div
      className={`${sizeClasses[size]} shrink-0 font-bold rounded-full bg-main-color text-white overflow-hidden flex items-center justify-center ${className}`}
    >
      {initial}
    </div>
  );
}
