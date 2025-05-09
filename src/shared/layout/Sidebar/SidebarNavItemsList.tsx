import cn from "classnames";

import {
  CommunityIcon,
  CreateCommunityIcon,
  DashboardIcon,
  InfoIcon,
  PostIcon,
  ProfilesIcon,
} from "src/assets/icons";
import { useAuth, useSidebar } from "src/context";
import { useScreenSize } from "src/hooks";
import { ROUTES } from "src/routes";

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
  const { isMdUp } = useScreenSize();
  const { currentSession } = useAuth();

  const isSidebarStatusShow = sidebarStatus === "show";

  const setIconsToShowStatus = () => {
    if (isSidebarStatusShow && !isMdUp) {
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
      text: "Profiles",
      path: ROUTES.profiles.root(),
      icon: <ProfilesIcon />,
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
        className={cn("flex flex-col gap-5", {
          "items-start": isSidebarStatusShow,
          "items-end": !isSidebarStatusShow,
        })}
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
