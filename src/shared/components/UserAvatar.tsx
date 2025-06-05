import cn from "classnames";
import { FC, useEffect, useState } from "react";
import { PhotoView } from "react-photo-view";

import { DefaultAvatarIcon } from "src/assets/icons";
import { UserData } from "src/types";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "5xl";

type UserAvatarProps = {
  avatarUrl: UserData["avatarUrl"];
  showNotification?: boolean;
  size?: AvatarSize;
  isPhotoView?: boolean;
  className?: string;
};

const AVATAR_SIZE: Record<AvatarSize, string> = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
  "2xl": "w-24 h-24",
  "5xl": "w-40 h-40",
};

export const UserAvatar: FC<UserAvatarProps> = ({
  avatarUrl,
  showNotification,
  size = "sm",
  isPhotoView = false,
  className,
}) => {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  useEffect(() => {
    setAvatarSrc(avatarUrl || null);
  }, [avatarUrl]);

  const handleImgError = () => {
    setAvatarSrc(null);
  };

  if (!avatarSrc) {
    return (
      <DefaultAvatarIcon
        className={cn(AVATAR_SIZE[size], "rounded-full bg-purple-800")}
      />
    );
  }

  const imgProps = {
    className: cn(
      "rounded-full object-cover",
      { "cursor-pointer": isPhotoView },
      AVATAR_SIZE[size],
      className
    ),
    src: avatarSrc,
    alt: "User Avatar",
    loading: "lazy" as const,
    onError: handleImgError,
  };

  if (!isPhotoView) {
    return (
      <div className="relative">
        <img {...imgProps} />
        {showNotification && (
          <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
        )}
      </div>
    );
  }

  return (
    <PhotoView src={avatarSrc}>
      <img {...imgProps} />
    </PhotoView>
  );
};
