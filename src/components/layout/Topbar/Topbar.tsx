import { useSidebar } from "../../../context/SidebarContext";
import { AuthButton } from "../../AuthButton";
import { Logo } from "../../Logo";

export const Topbar = () => {
  const { sidebarStatus } = useSidebar();

  return (
    <aside
      className={`
        sticky top-0 left-0 right-0 z-20
        bg-[rgba(10,10,10,0.8)] backdrop-blur-sm shadow-[0px_1px_10px_1px] shadow-pink-950/80
      `}
    >
      <div
        className={`
          relative max-w-7xl mx-auto   
          px-1 md:px-4 py-2 h-[50px]
          flex items-center
          ${sidebarStatus !== "show" ? "justify-between" : "justify-end"}
        `}
      >
        <Logo />
        <AuthButton />
      </div>
    </aside>
  );
};
