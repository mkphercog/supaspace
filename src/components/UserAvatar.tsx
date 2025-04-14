import { FC } from "react";
import DefaultAvatar from "../assets/images/defaultAvatar.png";

type AvatarSize = "sm" | "md" | "lg" | "xl" | "2xl" | "5xl";

type UserAvatarProps = {
  avatarUrl?: string;
  size?: AvatarSize;
};

const AVATAR_SIZE: Record<AvatarSize, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
  "2xl": "w-24 h-24",
  "5xl": "w-40 h-40",
};

export const UserAvatar: FC<UserAvatarProps> = ({ avatarUrl, size = "sm" }) => {
  if (!avatarUrl) {
    return (
      <img
        className={`${AVATAR_SIZE[size]} rounded-full object-cover`}
        src={DefaultAvatar}
        alt="Default User Avatar"
      />
    );
  }

  return (
    <img
      className={`${AVATAR_SIZE[size]} rounded-full object-cover`}
      src={avatarUrl}
      alt="User Avatar"
      loading="lazy"
      onError={(e) => (e.currentTarget.src = DefaultAvatar)}
    />
  );
};
