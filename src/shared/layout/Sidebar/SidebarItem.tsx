import cn from "classnames";
import { FC, ReactNode } from "react";

import { useSidebar } from "src/context";
import { ROUTES } from "src/routes";
import { Button, Typography } from "src/shared/UI";

export type SidebarItemBaseProps = {
  text: ReactNode;
  icon: ReactNode;
  isVisible: boolean;
  onClick?: () => void;
};

type SidebarButtonItemProps = {
  as: "button";
  path?: never;
} & SidebarItemBaseProps;

export type SidebarLinkItemProps = {
  as: "link";
  path: string;
} & SidebarItemBaseProps;

type SidebarItemProps = SidebarButtonItemProps | SidebarLinkItemProps;

export const SidebarItem: FC<SidebarItemProps> = ({
  as,
  text,
  icon,
  isVisible,
  onClick,
  ...restProps
}) => {
  const { sidebarStatus } = useSidebar();

  const isSidebarOpen = sidebarStatus === "show";

  if (!isVisible) return null;

  if (as === "button") {
    return (
      <Button
        variant="ghost"
        onClick={onClick}
        className={cn(
          "flex items-center p-0! font-semibold hover:bg-transparent!",
          {
            "w-full hover:scale-105": isSidebarOpen,
            "w-auto hover:scale-125": !isSidebarOpen,
          }
        )}
      >
        <div className="flex items-center gap-2">
          {icon}
          {isSidebarOpen && <Typography.Text>{text}</Typography.Text>}
        </div>
      </Button>
    );
  }

  return (
    <li
      onClick={onClick}
      className={cn("list-none!", {
        "w-full": isSidebarOpen,
        "w-auto": !isSidebarOpen,
      })}
    >
      <Typography.Link
        to={restProps.path || ROUTES.root()}
        className="font-semibold"
      >
        {({ isActive }) => (
          <div
            className={cn(
              "flex items-center gap-2 hover:text-purple-600 transition duration-300",
              {
                "hover:scale-105": isSidebarOpen,
                "hover:scale-125": !isSidebarOpen,
                "text-purple-600": isActive,
                "text-gray-300": !isActive,
              }
            )}
          >
            {icon}
            {isSidebarOpen && text}
          </div>
        )}
      </Typography.Link>
    </li>
  );
};
