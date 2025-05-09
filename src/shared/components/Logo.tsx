import cn from "classnames";
import { FC } from "react";

import { LogoIcon } from "src/assets/icons";
import { useSidebar } from "src/context";
import { ROUTES } from "src/routes";
import { Typography } from "src/shared/UI";

type LogoProps = {
  isInSidebar?: boolean;
};

export const Logo: FC<LogoProps> = ({ isInSidebar = false }) => {
  const { sidebarStatus } = useSidebar();

  const isSidebarStatusWithIcon = sidebarStatus.includes("icon");

  if (isInSidebar) {
    return (
      <Typography.Link
        aria-label="Supabase logo - redirect to home"
        to={ROUTES.root()}
        className={cn("self-start flex items-center gap-2", {
          "h-auto hover:scale-110": isSidebarStatusWithIcon,
          "h-[40px] hover:scale-105": !isSidebarStatusWithIcon,
        })}
      >
        {sidebarStatus !== "hidden" && <Image />}
        {sidebarStatus === "show" && <Name />}
      </Typography.Link>
    );
  }

  if (sidebarStatus === "show") return null;

  return (
    <Typography.Link
      aria-label="Supabase logo - redirect to home"
      to={ROUTES.root()}
      className="px-3 py-1 h-full flex items-center gap-2 hover:scale-105"
    >
      {!isSidebarStatusWithIcon && <Image />}
      <Name />
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
