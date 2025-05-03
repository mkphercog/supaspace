import { useFetchPosts } from "src/api/posts";
import { Typography } from "src/components/ui";

import { Loader } from "./Loader";
import { PostItem } from "./PostItem";

export const PostList = () => {
  const { data, error, isLoading } = useFetchPosts();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data?.length) {
    return (
      <Typography.Text className="text-md text-center mt-2">
        No posts found
      </Typography.Text>
    );
  }

  return (
    <ul className="flex flex-wrap gap-6 justify-center">
      {data?.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  );
};
