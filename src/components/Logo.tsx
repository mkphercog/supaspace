import { FC } from "react";
import { useSidebar } from "../context/SidebarContext/SidebarContext.hook";
import { Typography } from "./ui";

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
              ? "hover:scale-110"
              : "hover:scale-105"
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
      className="h-full flex items-center gap-2 hover:scale-105"
    >
      {sidebarStatus === "hidden" && <Image />}
      {sidebarStatus !== "show" && <Name />}
    </Typography.Link>
  );
};

const Image = () => (
  <img
    src="/favicon.ico"
    alt="Supa.space() logo"
    className="w-auto h-full rounded-full object-cover"
  />
);

const Name = () => (
  <div className="flex">
    <Typography.Text className="font-semibold">Supa</Typography.Text>
    <Typography.Text className="font-semibold" color="lightPurple">
      {".space()"}
    </Typography.Text>
  </div>
);
