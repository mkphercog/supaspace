import {
  CommunityIcon,
  CreateCommunityIcon,
  DashboardIcon,
  InfoIcon,
  PostIcon,
} from "../../../assets/icons";
import { ROUTES } from "../../../routes/routes";
import { useAuth } from "../../../context/AuthContext";
import { useSidebar } from "../../../context/SidebarContext";
import {
  SidebarItem,
  SidebarItemBaseProps,
  SidebarLinkItemProps,
} from "./SidebarItem";
import { useScreenSize } from "../../../hooks/useScreenSize";

type SidebarItemType = Omit<SidebarItemBaseProps, "isSidebarOpen"> & {
  path: SidebarLinkItemProps["path"];
};

export const SidebarNavItemsList = () => {
  const { sidebarStatus, setStatusOfSidebar } = useSidebar();
  const { isMdUp } = useScreenSize();
  const { currentSession } = useAuth();

  const setIconsToShowStatus = () => {
    if (sidebarStatus === "show" && !isMdUp) {
      setStatusOfSidebar("iconsToShow");
    }
  };

  const SIDEBAR_ITEMS: SidebarItemType[] = [
    {
      text: "Dashboard",
      path: ROUTES.root(),
      icon: <DashboardIcon />,
      isVisible: true,
      onClick: setIconsToShowStatus,
    },
    {
      text: "New post",
      path: ROUTES.post.create(),
      icon: <PostIcon />,
      isVisible: !!currentSession,
      onClick: setIconsToShowStatus,
    },
    {
      text: "Communities",
      path: ROUTES.community.list(),
      icon: <CommunityIcon />,
      isVisible: true,
      onClick: setIconsToShowStatus,
    },
    {
      text: "New community",
      path: ROUTES.community.create(),
      icon: <CreateCommunityIcon />,
      isVisible: !!currentSession,
      onClick: setIconsToShowStatus,
    },
    {
      text: "Info",
      path: ROUTES.appInfo(),
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
