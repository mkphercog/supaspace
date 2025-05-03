import { FC } from "react";
import { useNavigate } from "react-router";

import { SignInIcon, SignOutIcon, SettingsIcon } from "src/assets/icons";
import { useClickOutside } from "src/hooks";
import { ROUTES } from "src/routes";
import { UserAvatar } from "src/shared/components";

import { AuthButtonsProps } from "./AuthButton.types";
import { SidebarItem } from "../Sidebar/SidebarItem";

export const SidebarAuthButton: FC<AuthButtonsProps> = ({
  userData,
  sidebarStatus,
  isAvatarMenuOpen,
  toggleAvatarMenu,
  closeAvatarMenu,
  goToSettings,
  signOut,
}) => {
  const ref = useClickOutside<HTMLDivElement>(closeAvatarMenu);
  const navigate = useNavigate();

  if (!userData) {
    return (
      <SidebarItem
        as="button"
        text="Sign in"
        icon={<SignInIcon />}
        isVisible={true}
        onClick={() => navigate(ROUTES.auth.signIn())}
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
          text={userData.nickname}
          icon={
            <UserAvatar
              size={sidebarStatus === "show" ? "md" : "xs"}
              avatarUrl={userData.avatarUrl}
            />
          }
          isVisible={!!userData}
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
          isVisible={!!userData}
          onClick={goToSettings}
        />

        <SidebarItem
          as="button"
          text="Sign out"
          icon={<SignOutIcon />}
          isVisible={!!userData}
          onClick={signOut}
        />
      </div>
    </div>
  );
};
