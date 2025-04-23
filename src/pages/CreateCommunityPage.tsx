import { CreateCommunity } from "../components/CreateCommunity";
import { Typography } from "../components/ui";

const CreateCommunityPage = () => {
  return (
    <div>
      <Typography.Header>Create new community</Typography.Header>
      <CreateCommunity />
    </div>
  );
};

export default CreateCommunityPage;
