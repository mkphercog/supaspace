import cn from "classnames";
import { FC } from "react";
import { useNavigate } from "react-router";

import {
  SignInIcon,
  SignOutIcon,
  SettingsIcon,
  BellWithDotIcon,
  BellIcon,
} from "src/assets/icons";
import { useClickOutside } from "src/hooks";
import { ROUTES } from "src/routes";
import { UserAvatar } from "src/shared/components";

import { AuthButtonsProps } from "./AuthButton.types";
import { SidebarItem } from "../Sidebar/SidebarItem";

export const SidebarAuthButton: FC<AuthButtonsProps> = ({
  userData,
  areNotificationsUnread,
  sidebarStatus,
  isAvatarMenuOpen,
  toggleAvatarMenu,
  closeAvatarMenu,
  goToSettings,
  goToNotifications,
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
          text={userData.displayName}
          icon={
            <UserAvatar
              size={sidebarStatus === "show" ? "md" : "xs"}
              avatarUrl={userData.avatarUrl}
              showNotification={areNotificationsUnread}
            />
          }
          isVisible={!!userData}
          onClick={toggleAvatarMenu}
        />
      </div>

      <div
        className={cn(
          "absolute left-3 px-3 py-2 flex flex-col gap-2",
          "bg-[rgba(12,13,15,0.95)] rounded-md border-1 border-white/10",
          "transition-all duration-[400ms]",
          {
            "opacity-100 bottom-[65px]": isAvatarMenuOpen,
            "opacity-0 bottom-[-130px] pointer-events-none": !isAvatarMenuOpen,
            hidden: sidebarStatus === "hidden",
          }
        )}
      >
        <SidebarItem
          as="button"
          text="Notifications"
          icon={
            areNotificationsUnread ? (
              <BellWithDotIcon dotClassNames="text-purple-500" />
            ) : (
              <BellIcon />
            )
          }
          isVisible={!!userData}
          onClick={goToNotifications}
        />

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
