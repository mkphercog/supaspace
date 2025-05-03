import { Typography } from "src/shared/UI";

import { CommunityList } from "./components";

export const CommunityListPage = () => {
  return (
    <div>
      <Typography.Header>Communities</Typography.Header>
      <CommunityList />
    </div>
  );
};
