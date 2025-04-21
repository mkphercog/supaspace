import { FC } from "react";
import { AuthButtonsProps } from "./AuthButton.types";
import { useClickOutside } from "../../hooks/useClickOutside";
import { SidebarItem } from "../layout/Sidebar/SidebarItem";
import { SignInIcon, SignOutIcon, SettingsIcon } from "../../assets/icons";
import { UserAvatar } from "../UserAvatar";

export const SidebarAuthButton: FC<AuthButtonsProps> = ({
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
      <SidebarItem
        as="button"
        text="Sign in"
        icon={<SignInIcon />}
        isVisible={true}
        onClick={signInWithGoogle}
      />
    );
  }

  return (
    <div
      ref={ref}
      className="flex flex-col gap-4 items-end justify-end md:flex-row"
    >
      <div className="w-full flex items-center">
        <SidebarItem
          as="button"
          text={dbUserData.nickname}
          icon={
            <UserAvatar
              size={sidebarStatus === "show" ? "md" : "xs"}
              avatarUrl={dbUserData?.avatar_url}
            />
          }
          isVisible={!!dbUserData}
          onClick={toggleAvatarMenu}
        />
      </div>

      <div
        className={`
          absolute left-3 px-3 py-2
          flex flex-col gap-2
          bg-[rgba(12,13,15,0.95)] backdrop-blur-sm rounded-md 
          border-1 border-white/10
          ${
            isAvatarMenuOpen
              ? "opacity-100 bottom-[65px]"
              : "opacity-0 bottom-[-130px]"
          }
          ${sidebarStatus === "hidden" ? "hidden" : ""}
          transition-all duration-500
        `}
      >
        <SidebarItem
          as="button"
          text="Settings"
          icon={<SettingsIcon />}
          isVisible={!!dbUserData}
          onClick={goToSettings}
        />

        <SidebarItem
          as="button"
          text="Sign out"
          icon={<SignOutIcon />}
          isVisible={!!dbUserData}
          onClick={signOut}
        />
      </div>
    </div>
  );
};
