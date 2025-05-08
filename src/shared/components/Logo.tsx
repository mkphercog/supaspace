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

  if (isInSidebar) {
    return (
      <Typography.Link
        aria-label="Supabase logo - redirect to home"
        to={ROUTES.root()}
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

  if (sidebarStatus === "show") return null;

  return (
    <Typography.Link
      aria-label="Supabase logo - redirect to home"
      to={ROUTES.root()}
      className="px-3 py-1 h-full flex items-center gap-2 hover:scale-105"
    >
      {!sidebarStatus.includes("icon") && <Image />}
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
