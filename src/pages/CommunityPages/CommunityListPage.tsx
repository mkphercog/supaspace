import { Typography } from "src/components/ui";

import { CommunityList } from "./components";

export const CommunityListPage = () => {
  return (
    <div>
      <Typography.Header>Communities</Typography.Header>
      <CommunityList />
    </div>
  );
};
