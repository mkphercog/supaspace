import {
  CommunityIcon,
  CreateCommunityIcon,
  DashboardIcon,
  InfoIcon,
  PostIcon,
} from "../../../assets/icons";
import { useAuth } from "../../../context/AuthContext";
import { useSidebar } from "../../../context/SidebarContext";
import {
  SidebarItem,
  SidebarItemBaseProps,
  SidebarLinkItemProps,
} from "./SidebarItem";

type SidebarItemType = Omit<SidebarItemBaseProps, "isSidebarOpen"> & {
  path: SidebarLinkItemProps["path"];
};

export const SidebarNavItemsList = () => {
  const { sidebarStatus, setStatusOfSidebar } = useSidebar();
  const { currentSession, isAdmin } = useAuth();

  const setIconsToShowStatus = () => {
    if (sidebarStatus === "show") {
      setStatusOfSidebar("iconsToShow");
    }
  };

  const SIDEBAR_ITEMS: SidebarItemType[] = [
    {
      text: "Dashboard",
      path: "/",
      icon: <DashboardIcon />,
      isVisible: true,
      onClick: setIconsToShowStatus,
    },
    {
      text: "New post",
      path: "/create",
      icon: <PostIcon />,
      isVisible: !!currentSession,
      onClick: setIconsToShowStatus,
    },
    {
      text: "Communities",
      path: "/communities",
      icon: <CommunityIcon />,
      isVisible: true,
      onClick: setIconsToShowStatus,
    },
    {
      text: "New community",
      path: "/community/create",
      icon: <CreateCommunityIcon />,
      isVisible: !!isAdmin,
      onClick: setIconsToShowStatus,
    },
    {
      text: "Info",
      path: "/info",
      icon: <InfoIcon />,
      isVisible: true,
      onClick: setIconsToShowStatus,
    },
  ];

  return (
    <nav>
      <ul
        className={`flex flex-col gap-5 
          ${sidebarStatus === "show" ? "items-start" : "items-end"} 
        `}
      >
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarItem
            key={item.path}
            as="link"
            text={item.text}
            path={item.path}
            icon={item.icon}
            isVisible={item.isVisible}
            onClick={item.onClick}
          />
        ))}
      </ul>
    </nav>
  );
};
