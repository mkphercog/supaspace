import cn from "classnames";

import { ChevronUpIcon, CloseIcon } from "src/assets/icons";
import { useSidebar } from "src/context";
import { Logo } from "src/shared/components";
import { Button } from "src/shared/UI";

export const SidebarHeader = () => {
  const { sidebarStatus, setStatusOfSidebar, toggleSidebarStatus } =
    useSidebar();

  const isSidebarStatusHidden = sidebarStatus === "hidden";

  return (
    <header className="w-full flex flex-col justify-between">
      <Button
        ariaLabel="Toggle sidebar menu"
        onClick={toggleSidebarStatus}
        variant="ghost"
        className={cn(
          "self-end p-0! absolute top-[80px]",
          "flex justify-center items-center",
          "bg-purple-600/50! focus:outline-none hover:scale-110",
          {
            "right-[-26px]": sidebarStatus.includes("icons"),
            "rounded-r-full right-[-26px]": isSidebarStatusHidden,
            "rounded-r-full right-0 md:right-[-26px]": !isSidebarStatusHidden,
            "rounded-l-full rounded-r-none md:rounded-l-none md:rounded-r-full":
              sidebarStatus === "show",
          }
        )}
      >
        <ChevronUpIcon
          className={cn("transition duration-500", {
            "rotate-90":
              sidebarStatus === "iconsToShow" || isSidebarStatusHidden,
            "-rotate-90": !(
              sidebarStatus === "iconsToShow" || isSidebarStatusHidden
            ),
          })}
        />
      </Button>

      {sidebarStatus === "show" && (
        <Button
          ariaLabel="Close sidebar menu"
          onClick={() => setStatusOfSidebar("hidden")}
          variant="ghost"
          className={`
              self-end m-0 p-0!
              absolute top-[15px] right-[10px]
              flex justify-center items-center 
              rounded-full! focus:outline-none hover:scale-110 
            `}
        >
          <CloseIcon />
        </Button>
      )}

      <Logo isInSidebar />
    </header>
  );
};
