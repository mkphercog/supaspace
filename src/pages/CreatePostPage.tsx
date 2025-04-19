import { CreatePost } from "../components/CreatePost";
import { Typography } from "../components/ui";

export const CreatePostPage = () => {
  return (
    <div>
      <Typography.Header>Create new post</Typography.Header>
      <CreatePost />
    </div>
  );
};
