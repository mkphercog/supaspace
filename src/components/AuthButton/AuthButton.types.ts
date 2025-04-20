import { SidebarStatusType } from "../../context/SidebarContext/SidebarContext";
import { DbUserDataType } from "../../types/users";

export type AuthButtonsProps = {
  dbUserData: DbUserDataType | null;
  sidebarStatus: SidebarStatusType;
  isAvatarMenuOpen: boolean;
  toggleAvatarMenu: () => void;
  closeAvatarMenu: () => void;
  goToSettings: () => void;
  signInWithGoogle: () => void;
  signOut: () => void;
};
