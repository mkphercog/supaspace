import { FC } from "react";
import { AuthButtonsProps } from "./AuthButton.types";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Button, Typography } from "../ui";
import { SignInIcon, SignOutIcon, SettingsIcon } from "../../assets/icons";
import { UserAvatar } from "../UserAvatar";

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
      className="flex flex-col gap-4 items-end justify-end md:flex-row"
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
          absolute right-4 px-3 py-2
          flex flex-col gap-2
          bg-[rgba(12,13,15,0.95)] backdrop-blur-sm rounded-md 
          border-1 border-white/10
          ${
            isAvatarMenuOpen
              ? "opacity-100 top-[60px]"
              : "opacity-0 top-[-130px]"
          }
          transition-all duration-500
        `}
      >
        <Button className="flex gap-2" onClick={goToSettings} variant="ghost">
          <SettingsIcon />
          <Typography.Text>Settings</Typography.Text>
        </Button>

        <Button className="flex gap-2" onClick={signOut} variant="ghost">
          <SignOutIcon />
          <Typography.Text>Sign out</Typography.Text>
        </Button>
      </div>
    </div>
  );
};
