import { SidebarStatusType } from "../../../context/SidebarContext/SidebarContext";
import { useSidebar } from "../../../context/SidebarContext/SidebarContext.hook";
import { AuthButton } from "../../AuthButton";
import { SidebarNavItemsList } from "./SidebarNavItemsList";
import { SidebarHeader } from "./SidebarHeader";

const SIDEBRAR_VISIBILITY_CLASSES: Record<SidebarStatusType, string> = {
  show: "p-3 w-full md:w-[250px]",
  iconsToShow: "p-3 w-[50px]",
  iconsToHide: "p-3  w-[50px]",
  hidden: "p-0! w-0",
};

export const Sidebar = () => {
  const { sidebarStatus } = useSidebar();

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
        className={`
          flex ${sidebarStatus === "show" ? "justify-start" : "justify-end"} 
        `}
      >
        <AuthButton isInSidebar />
      </footer>
    </aside>
  );
};
