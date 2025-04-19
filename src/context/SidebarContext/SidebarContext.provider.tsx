import { FC, PropsWithChildren, useState } from "react";
import {
  SidebarContext,
  SidebarContextType,
  SidebarStatusType,
} from "./SidebarContext";

export const SidebarProvider: FC<PropsWithChildren> = ({ children }) => {
  const [sidebarStatus, setSidebarStatus] =
    useState<SidebarStatusType>("iconsToShow");

  const toggleSidebarStatus = () => {
    setSidebarStatus(() => {
      switch (sidebarStatus) {
        case "hidden":
          return "iconsToShow";

        case "iconsToShow":
          return "show";

        case "show":
          return "iconsToHide";

        case "iconsToHide":
          return "hidden";
      }
    });
  };

  const setStatusOfSidebar = (status: SidebarStatusType) => {
    setSidebarStatus(status);
  };

  const value: SidebarContextType = {
    sidebarStatus,
    toggleSidebarStatus,
    setStatusOfSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
