import { Typography } from "src/components/ui";

import { CreatePost } from "../components/CreatePost";

export const CreatePostPage = () => {
  return (
    <div>
      <Typography.Header>Create post</Typography.Header>
      <CreatePost />
    </div>
  );
};
