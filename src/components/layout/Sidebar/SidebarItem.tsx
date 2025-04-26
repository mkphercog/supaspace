import { FC, ReactNode } from "react";
import { Button, Typography } from "../../ui";
import { useSidebar } from "../../../context/SidebarContext";
import { ROUTES } from "../../../routes/routes";

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
      <li
        onClick={onClick}
        className={`
          flex items-center list-none!
          ${isSidebarOpen ? "w-full" : "w-auto"}
        `}
      >
        <Button
          variant="ghost"
          className={`
            p-0! font-semibold
            ${isSidebarOpen ? "hover:scale-105" : "hover:scale-125"}
            hover:bg-transparent!
          `}
        >
          <div className="flex items-center gap-2">
            {icon}
            {isSidebarOpen && <Typography.Text>{text}</Typography.Text>}
          </div>
        </Button>
      </li>
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
