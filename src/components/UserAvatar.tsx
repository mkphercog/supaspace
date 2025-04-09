import { FC } from "react";
import DefaultAvatar from "../assets/images/defaultAvatar.png";

type UserAvatarProps = {
  avatarUrl?: string;
};

export const UserAvatar: FC<UserAvatarProps> = ({ avatarUrl }) => {
  if (!avatarUrl) {
    return (
      <img
        className="w-8 h-8 rounded-full object-cover"
        src={DefaultAvatar}
        alt="Default User Avatar"
      />
    );
  }

  return (
    <img
      className="w-8 h-8 rounded-full object-cover"
      src={avatarUrl}
      alt="User Avatar"
      loading="lazy"
      onError={(e) => (e.currentTarget.src = DefaultAvatar)}
    />
  );
};
