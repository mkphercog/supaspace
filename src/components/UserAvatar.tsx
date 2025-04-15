import { FC, SyntheticEvent } from "react";
import DefaultAvatar from "../assets/images/defaultAvatar.png";
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

const getUserAvatarData = (size: AvatarSize, avatarUrl?: string) => {
  return {
    className: `${AVATAR_SIZE[size]} rounded-full object-cover`,
    src: avatarUrl,
    alt: "User Avatar",
    loading: "lazy" as HTMLImageElement["loading"],
    onError: (e: SyntheticEvent<HTMLImageElement, Event>) =>
      (e.currentTarget.src = DefaultAvatar),
  };
};

export const UserAvatar: FC<UserAvatarProps> = ({
  avatarUrl,
  size = "sm",
  isPhotoView = false,
}) => {
  const userAvatarData = getUserAvatarData(size, avatarUrl);

  if (!avatarUrl) {
    return (
      <img
        className={userAvatarData["className"]}
        src={DefaultAvatar}
        alt="Default User Avatar"
      />
    );
  }

  if (!isPhotoView) {
    return <img {...userAvatarData} />;
  }

  return (
    <PhotoView src={avatarUrl}>
      <img {...userAvatarData} />
    </PhotoView>
  );
};
