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
import { Button, Typography } from "src/shared/UI";

import { AuthButtonsProps } from "./AuthButton.types";

export const TopbarAuthButton: FC<AuthButtonsProps> = ({
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
      <div className="self-end">
        <Button
          className="flex gap-2"
          variant="ghost"
          onClick={() => navigate(ROUTES.auth.signIn())}
        >
          <SignInIcon />
          <Typography.Text
            className={cn("md:inline", { "hidden!": sidebarStatus === "show" })}
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
          <UserAvatar
            avatarUrl={userData.avatarUrl}
            showNotification={areNotificationsUnread}
          />
          {sidebarStatus !== "show" && (
            <Typography.Text className="font-semibold text-inherit">
              {userData.displayName}
            </Typography.Text>
          )}
        </Button>
      </div>

      <div
        className={cn(
          "absolute right-4 px-3 py-2 flex flex-col gap-2",
          "bg-[rgba(12,13,15,0.95)] rounded-md border-1 border-white/10",
          "transition-all duration-[400ms]",
          {
            "opacity-100 top-[60px]": isAvatarMenuOpen,
            "opacity-0 top-[-130px] pointer-events-none": !isAvatarMenuOpen,
          }
        )}
      >
        <Button
          className="flex gap-2"
          onClick={goToNotifications}
          variant="ghost"
        >
          {areNotificationsUnread ? (
            <BellWithDotIcon dotClassNames="text-purple-500" />
          ) : (
            <BellIcon />
          )}

          <Typography.Text>Notifications</Typography.Text>
        </Button>

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
