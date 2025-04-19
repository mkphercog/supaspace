import { PostItem } from "./PostItem";
import { useFetchPosts } from "../api/posts";
import { Loader } from "./Loader";
import { Typography } from "./ui";

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
