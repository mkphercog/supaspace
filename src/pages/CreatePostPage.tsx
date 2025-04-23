import { CreatePost } from "../components/CreatePost";
import { Typography } from "../components/ui";

const CreatePostPage = () => {
  return (
    <div>
      <Typography.Header>Create new post</Typography.Header>
      <CreatePost />
    </div>
  );
};

export default CreatePostPage;
