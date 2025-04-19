import { FC } from "react";
import { AuthButtonsProps } from "./AuthButton.types";
import { useClickOutside } from "../../hooks/useClickOutside";
import { SidebarItem } from "../layout/Sidebar/SidebarItem";
import { SignInIcon } from "../../assets/icons/SignInIcon";
import { UserAvatar } from "../UserAvatar";
import { SettingsIcon } from "../../assets/icons/SettingsIcon";
import { SignOutIcon } from "../../assets/icons/SignOutIcon";

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
        isSidebarOpen={sidebarStatus === "show"}
        onClick={signInWithGoogle}
      />
    );
  }

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-4 items-end justify-end md:flex-row"
    >
      <div className="w-full flex items-center">
        <SidebarItem
          as="button"
          text={dbUserData.display_name}
          icon={
            <UserAvatar
              size={sidebarStatus === "show" ? "md" : "xs"}
              avatarUrl={dbUserData?.avatar_url}
            />
          }
          isVisible={!!dbUserData}
          isSidebarOpen={sidebarStatus === "show"}
          onClick={toggleAvatarMenu}
        />
      </div>

      <div
        className={`
          absolute left-0 px-5 py-3 
          flex flex-col gap-2
          bg-gray-800/70 backdrop-blur-sm rounded-md
          ${
            isAvatarMenuOpen
              ? "opacity-100 bottom-[60px]"
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
          isSidebarOpen={sidebarStatus === "show"}
          onClick={goToSettings}
        />

        <SidebarItem
          as="button"
          text="Sign out"
          icon={<SignOutIcon />}
          isVisible={!!dbUserData}
          isSidebarOpen={sidebarStatus === "show"}
          onClick={signOut}
        />
      </div>
    </div>
  );
};
