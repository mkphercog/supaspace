import { FC, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth, useSidebar } from "src/context";
import { useScreenSize } from "src/hooks";
import { ROUTES } from "src/routes";

import { AuthButtonsProps } from "./AuthButton.types";
import { SidebarAuthButton } from "./SidebarAuthButton";
import { TopbarAuthButton } from "./TopbarAuthButton";

type AuthButtonProps = {
  isInSidebar?: boolean;
};

export const AuthButton: FC<AuthButtonProps> = ({ isInSidebar = false }) => {
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const {
    userData,
    notifications: { areUnread: areNotificationsUnread },
    signInWithGoogle,
    signOut,
  } = useAuth();
  const { sidebarStatus, setStatusOfSidebar } = useSidebar();
  const { isMdUp } = useScreenSize();
  const navigate = useNavigate();

  const closeAvatarMenu = () => {
    setIsAvatarMenuOpen(false);
  };

  const toggleAvatarMenu = () => {
    setIsAvatarMenuOpen((prev) => !prev);
  };

  const goToSettings = () => {
    if (sidebarStatus === "show" && !isMdUp) {
      setStatusOfSidebar("iconsToShow");
    }
    closeAvatarMenu();
    navigate(ROUTES.settings());
  };

  const goToNotifications = () => {
    if (sidebarStatus === "show" && !isMdUp) {
      setStatusOfSidebar("iconsToShow");
    }
    closeAvatarMenu();
    navigate(ROUTES.notifications());
  };

  const props: AuthButtonsProps = {
    userData,
    areNotificationsUnread,
    sidebarStatus,
    isAvatarMenuOpen,
    toggleAvatarMenu,
    closeAvatarMenu,
    goToSettings,
    goToNotifications,
    signInWithGoogle,
    signOut,
  };

  if (isInSidebar) return <SidebarAuthButton {...props} />;

  return <TopbarAuthButton {...props} />;
};
