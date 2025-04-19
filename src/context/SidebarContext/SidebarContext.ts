import { createContext } from "react";

export type SidebarStatusType =
  | "show"
  | "iconsToShow"
  | "iconsToHide"
  | "hidden";

export type SidebarContextType = {
  sidebarStatus: SidebarStatusType;
  toggleSidebarStatus: () => void;
  setStatusOfSidebar: (status: SidebarStatusType) => void;
};

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined,
);
