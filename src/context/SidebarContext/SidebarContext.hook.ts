import { useContext } from "react";
import { SidebarContext, SidebarContextType } from "./SidebarContext";

export const useSidebar = (): SidebarContextType => {
 const context = useContext(SidebarContext);

 if (context === undefined) {
  throw new Error("useSidebar must be used within the SidebarProvider");
 }

 return context;
};
