import { Typography } from "src/shared/UI";

import { PostList } from "./components/PostList";

export const HomePage = () => {
  return (
    <div>
      <Typography.Header>Recent posts</Typography.Header>
      <PostList />
    </div>
  );
};
