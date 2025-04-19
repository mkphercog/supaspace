import { FC } from "react";
import { AuthButtonsProps } from "./AuthButton.types";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Button, Typography } from "../ui";
import { SignInIcon } from "../../assets/icons/SignInIcon";
import { UserAvatar } from "../UserAvatar";
import { SettingsIcon } from "../../assets/icons/SettingsIcon";
import { SignOutIcon } from "../../assets/icons/SignOutIcon";

export const TopbarAuthButton: FC<AuthButtonsProps> = ({
  dbUserData,
  sidebarStatus,
  isAvatarMenuOpen,
  toggleAvatarMenu,
  closeAvatarMenu,
  goToSettings,
  signInWithGoogle,
  signOut,
}) => {
  const ref = useClickOutside<HTMLDivElement>(closeAvatarMenu);

  if (!dbUserData) {
    return (
      <div className="self-end">
        <Button
          className="flex gap-2"
          variant="ghost"
          onClick={signInWithGoogle}
        >
          <SignInIcon />
          <Typography.Text
            className={`${sidebarStatus === "show" ? "hidden!" : ""} md:inline`}
          >
            Sign in
          </Typography.Text>
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-4 items-end justify-end md:flex-row"
    >
      <div className="w-full flex items-center">
        <Button
          className="shrink-0 flex items-center gap-2 m-0"
          onClick={toggleAvatarMenu}
          variant="ghost"
        >
          <UserAvatar avatarUrl={dbUserData.avatar_url} />
          <Typography.Text className="font-semibold text-inherit">
            {dbUserData.display_name}
          </Typography.Text>
        </Button>
      </div>

      <div
        className={`
          absolute right-0 px-5 py-3
          flex flex-col gap-2
          bg-gray-800/70 backdrop-blur-sm rounded-md 
          ${
            isAvatarMenuOpen
              ? "opacity-100 top-[60px]"
              : "opacity-0 top-[-130px]"
          }
          transition-all duration-500
        `}
      >
        <Button className="flex gap-2" onClick={goToSettings} variant="ghost">
          <SettingsIcon /> Settings
        </Button>

        <Button className="flex gap-2" onClick={signOut} variant="ghost">
          <SignOutIcon /> Sign out
        </Button>
      </div>
    </div>
  );
};
