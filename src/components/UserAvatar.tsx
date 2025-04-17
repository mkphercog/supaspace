import { FC, useEffect, useState } from "react";
import DefaultAvatar from "../assets/icons/defaultAvatar.svg";
import { PhotoView } from "react-photo-view";

type AvatarSize = "sm" | "md" | "lg" | "xl" | "2xl" | "5xl";

type UserAvatarProps = {
  avatarUrl?: string;
  size?: AvatarSize;
  isPhotoView?: boolean;
};

const AVATAR_SIZE: Record<AvatarSize, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
  "2xl": "w-24 h-24",
  "5xl": "w-40 h-40",
};

export const UserAvatar: FC<UserAvatarProps> = ({
  avatarUrl,
  size = "sm",
  isPhotoView = false,
}) => {
  const [avatarSrc, setAvatarSrc] = useState(DefaultAvatar);

  useEffect(() => {
    setAvatarSrc(avatarUrl || DefaultAvatar);
  }, [avatarUrl]);

  const handleImgError = () => {
    setAvatarSrc(DefaultAvatar);
  };

  const imgProps = {
    className: `${AVATAR_SIZE[size]} rounded-full object-cover ${
      isPhotoView ? "cursor-pointer" : ""
    }`,
    src: avatarSrc,
    alt: "User Avatar",
    loading: "lazy" as const,
    onError: handleImgError,
  };

  if (!isPhotoView) {
    return <img {...imgProps} />;
  }

  return (
    <PhotoView src={avatarSrc}>
      <img {...imgProps} />
    </PhotoView>
  );
};
