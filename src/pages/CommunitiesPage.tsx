import { CommunityList } from "../components/CommunityList";
import { Typography } from "../components/ui";

export const CommunitiesPage = () => {
  return (
    <div>
      <Typography.Header>Communities</Typography.Header>
      <CommunityList />
    </div>
  );
};
