interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  image?: string;
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
  image,
}: UserAvatarProps) {
  const initial = name?.charAt(0)?.toUpperCase() || "";

  return (
    <div
      className={`${sizeClasses[size]} shrink-0 font-bold rounded-full bg-main-color text-white overflow-hidden flex items-center justify-center ${className}`}
    >
      {image ? (
        <img src={image} alt={name} className="w-full h-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}
