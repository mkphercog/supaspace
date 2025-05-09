import cn from "classnames";

import { SidebarStatusType, useSidebar } from "src/context";

import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavItemsList } from "./SidebarNavItemsList";
import { AuthButton } from "../AuthButton";

const SIDEBRAR_VISIBILITY_CLASSES: Record<SidebarStatusType, string> = {
  show: "p-3 w-full md:w-[250px]",
  iconsToShow: "p-3 w-[50px]",
  iconsToHide: "p-3  w-[50px]",
  hidden: "p-0! w-0",
};

export const Sidebar = () => {
  const { sidebarStatus } = useSidebar();

  const isSidebarStatusShow = sidebarStatus === "show";
  return (
    <aside
      className={`
        shrink-0 relative z-10
        flex flex-col h-dvh
        transition-all duration-300 
        bg-[rgba(10,10,10,0.8)] shadow-[1px_0px_10px_1px] shadow-purple-950/80
        ${SIDEBRAR_VISIBILITY_CLASSES[sidebarStatus]}
      `}
    >
      <SidebarHeader />

      <main className="grow mt-20">
        <SidebarNavItemsList />
      </main>

      <footer
        className={cn("flex", {
          "justify-start": isSidebarStatusShow,
          "justify-end": !isSidebarStatusShow,
        })}
      >
        <AuthButton isInSidebar />
      </footer>
    </aside>
  );
};
