import { Typography } from "src/shared/UI";

import { CreateCommunity } from "./components";

export const CreateCommunityPage = () => {
  return (
    <div>
      <Typography.Header>Create community</Typography.Header>
      <CreateCommunity />
    </div>
  );
};
