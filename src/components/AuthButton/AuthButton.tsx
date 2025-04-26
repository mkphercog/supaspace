import { FC, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import { AuthButtonsProps } from "./AuthButton.types";
import { SidebarAuthButton } from "./SidebarAuthButton";
import { TopbarAuthButton } from "./TopbarAuthButton";
import { ROUTES } from "../../routes/routes";
import { useScreenSize } from "../../hooks/useScreenSize";

type AuthButtonProps = {
  isInSidebar?: boolean;
};

export const AuthButton: FC<AuthButtonProps> = ({ isInSidebar = false }) => {
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const { dbUserData, signInWithGoogle, signOut } = useAuth();
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

  const props: AuthButtonsProps = {
    dbUserData,
    sidebarStatus,
    isAvatarMenuOpen,
    toggleAvatarMenu,
    closeAvatarMenu,
    goToSettings,
    signInWithGoogle,
    signOut,
  };

  if (isInSidebar) return <SidebarAuthButton {...props} />;

  return <TopbarAuthButton {...props} />;
};
