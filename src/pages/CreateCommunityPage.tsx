import { CreateCommunity } from "../components/CreateCommunity";
import { Typography } from "../components/ui";

export const CreateCommunityPage = () => {
  return (
    <div>
      <Typography.Header>Create new community</Typography.Header>
      <CreateCommunity />
    </div>
  );
};
