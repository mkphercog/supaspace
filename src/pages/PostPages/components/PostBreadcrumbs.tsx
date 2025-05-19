import { FC } from "react";

import { ArrowUpIcon, DashboardIcon } from "src/assets/icons";
import { ROUTES } from "src/routes";
import { Typography } from "src/shared/UI";
import { Post } from "src/types";

type Props = Pick<Post, "community" | "title">;

export const PostBreadcrumbs: FC<Props> = ({ title, community }) => {
  return (
    <div className="w-full overflow-auto flex items-center">
      <Typography.Link to={ROUTES.root()}>
        <DashboardIcon />
      </Typography.Link>

      <Separator />

      <Typography.Link
        className="shrink-0"
        to={ROUTES.community.details(community.id)}
      >
        {community.name}
      </Typography.Link>

      <Separator />

      <Typography.Text className="shrink-0">{title}</Typography.Text>
    </div>
  );
};

const Separator = () => {
  return (
    <Typography.Text>
      <ArrowUpIcon className="text-purple-600 rotate-90" />
    </Typography.Text>
  );
};
