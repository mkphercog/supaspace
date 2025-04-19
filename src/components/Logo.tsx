import { FC } from "react";
import { useSidebar } from "../context/SidebarContext/SidebarContext.hook";
import { Typography } from "./ui";
import { LogoIcon } from "../assets/icons";

type LogoProps = {
  isInSidebar?: boolean;
};

export const Logo: FC<LogoProps> = ({ isInSidebar = false }) => {
  const { sidebarStatus } = useSidebar();

  if (isInSidebar) {
    return (
      <Typography.Link
        to="/"
        className={`self-start flex items-center gap-2
          ${
            sidebarStatus.includes("icon")
              ? "h-auto hover:scale-110"
              : "h-[40px] hover:scale-105"
          }
              `}
      >
        {sidebarStatus !== "hidden" && <Image />}
        {sidebarStatus === "show" && <Name />}
      </Typography.Link>
    );
  }

  return (
    <Typography.Link
      to="/"
      className="px-3 py-1 h-full flex items-center gap-2 hover:scale-105"
    >
      {sidebarStatus === "hidden" && <Image />}
      {sidebarStatus !== "show" && <Name />}
    </Typography.Link>
  );
};

const Image = () => <LogoIcon className="w-auto h-full" />;

const Name = () => (
  <div className="flex">
    <Typography.Text className="font-semibold">Supa</Typography.Text>
    <Typography.Text className="font-semibold" color="lightPurple">
      {".space()"}
    </Typography.Text>
  </div>
);
