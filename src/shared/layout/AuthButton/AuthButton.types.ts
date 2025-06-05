import { SidebarStatusType } from "src/context";
import { UserData } from "src/types";

export type AuthButtonsProps = {
  userData: UserData | null;
  areNotificationsUnread: boolean;
  sidebarStatus: SidebarStatusType;
  isAvatarMenuOpen: boolean;
  toggleAvatarMenu: () => void;
  closeAvatarMenu: () => void;
  goToSettings: () => void;
  goToNotifications: () => void;
  signInWithGoogle: () => void;
  signOut: () => void;
};
