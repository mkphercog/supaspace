import cn from "classnames";

import { useSidebar } from "src/context";
import { Logo } from "src/shared/components";

import { AuthButton } from "./AuthButton";

export const Topbar = () => {
  const { sidebarStatus } = useSidebar();

  const isSidebarStatusShow = sidebarStatus === "show";

  return (
    <aside
      className={`
        sticky top-0 left-0 right-0 z-20
        bg-[rgba(10,10,10,0.8)] backdrop-blur-sm
        shadow-[0px_1px_10px_1px] shadow-pink-950/80
      `}
    >
      <div
        className={cn(
          "relative max-w-7xl mx-auto",
          "px-1 md:px-4 py-2 h-[50px]",
          "flex items-center",
          {
            "justify-between": !isSidebarStatusShow,
            "justify-end": isSidebarStatusShow,
          }
        )}
      >
        <Logo />
        <AuthButton />
      </div>
    </aside>
  );
};
