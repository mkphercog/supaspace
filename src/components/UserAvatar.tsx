import { FC, useEffect, useState } from "react";
import { PhotoView } from "react-photo-view";
import { DefaultAvatarIcon } from "../assets/icons";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "5xl";

type UserAvatarProps = {
  avatarUrl?: string;
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
        className={`${AVATAR_SIZE[size]} rounded-full bg-purple-800`}
      />
    );
  }

  const imgProps = {
    className: `
      ${AVATAR_SIZE[size]} rounded-full object-cover 
      ${isPhotoView ? "cursor-pointer" : ""} 
      ${className}
    `,
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
