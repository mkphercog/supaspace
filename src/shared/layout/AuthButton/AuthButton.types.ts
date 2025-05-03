import { SidebarStatusType } from "src/context";
import { DbUserDataType } from "src/types";

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
