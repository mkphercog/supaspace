import { CommunityList } from "../components/CommunityList";
import { Typography } from "../components/ui";

const CommunitiesPage = () => {
  return (
    <div>
      <Typography.Header>Communities</Typography.Header>
      <CommunityList />
    </div>
  );
};

export default CommunitiesPage;
