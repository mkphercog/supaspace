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
        className={`
          flex items-center
          p-0! font-semibold
          ${isSidebarOpen ? "w-full hover:scale-105" : "w-auto hover:scale-125"}
          hover:bg-transparent!
        `}
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
      className={`${isSidebarOpen ? "w-full" : "w-auto"} list-none!`}
    >
      <Typography.Link
        to={restProps.path || ROUTES.root()}
        className="font-semibold"
      >
        {({ isActive }) => (
          <div
            className={`
              flex items-center gap-2 
              ${isSidebarOpen ? "hover:scale-105" : "hover:scale-125"}
              ${isActive ? "text-purple-600 " : "text-gray-300 "}
              hover:text-purple-600 
              transition duration-300
            `}
          >
            {icon}
            {isSidebarOpen && text}
          </div>
        )}
      </Typography.Link>
    </li>
  );
};
