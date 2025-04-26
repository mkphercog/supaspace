import { PostList } from "../components/PostList";
import { Typography } from "../components/ui";

export const HomePage = () => {
  return (
    <div>
      <Typography.Header>Recent posts</Typography.Header>
      <PostList />
    </div>
  );
};
