import { SidebarStatusType } from "src/context";
import { UserData } from "src/types";

export type AuthButtonsProps = {
  userData: UserData | null;
  sidebarStatus: SidebarStatusType;
  isAvatarMenuOpen: boolean;
  toggleAvatarMenu: () => void;
  closeAvatarMenu: () => void;
  goToSettings: () => void;
  signInWithGoogle: () => void;
  signOut: () => void;
};
