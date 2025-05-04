import { Typography } from "src/shared/UI";

import { CreatePost } from "./components/CreatePost/CreatePost";

export const CreatePostPage = () => {
  return (
    <div>
      <Typography.Header>Create post</Typography.Header>
      <CreatePost />
    </div>
  );
};
