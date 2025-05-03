import { ChevronUpIcon, CloseIcon } from "src/assets/icons";
import { useSidebar } from "src/context";
import { Logo } from "src/shared/components";
import { Button } from "src/shared/UI";

export const SidebarHeader = () => {
  const { sidebarStatus, setStatusOfSidebar, toggleSidebarStatus } =
    useSidebar();

  return (
    <header className="w-full flex flex-col justify-between">
      <Button
        onClick={toggleSidebarStatus}
        variant="ghost"
        className={`
          self-end p-0! 
          absolute top-[80px]
          flex justify-center items-center
          ${sidebarStatus.includes("icons") ? "right-[-26px]" : ""}
          ${
            sidebarStatus === "hidden"
              ? "rounded-r-full right-[-26px]"
              : "rounded-r-full right-0 md:right-[-26px]"
          } 
          ${
            sidebarStatus === "show"
              ? "rounded-l-full rounded-r-none md:rounded-l-none md:rounded-r-full"
              : ""
          }
          bg-purple-600/50! focus:outline-none hover:scale-110
        `}
      >
        <ChevronUpIcon
          className={`
            ${
              sidebarStatus === "iconsToShow" || sidebarStatus === "hidden"
                ? "rotate-90"
                : "-rotate-90"
            }
          `}
        />
      </Button>

      {sidebarStatus === "show" && (
        <Button
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
