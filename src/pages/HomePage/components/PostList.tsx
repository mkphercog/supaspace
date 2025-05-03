import { useFetchPosts } from "src/api/posts";
import { PostItem } from "src/shared/components";
import { Loader, Typography } from "src/shared/UI";

export const PostList = () => {
  const { posts, arePostsLoading, postsError } = useFetchPosts();

  if (arePostsLoading) {
    return <Loader />;
  }

  if (postsError) {
    return <div>Error: {postsError.message}</div>;
  }

  if (!posts?.length) {
    return (
      <Typography.Text className="text-md text-center mt-2">
        No posts found
      </Typography.Text>
    );
  }

  return (
    <ul className="flex flex-wrap gap-6 justify-center">
      {posts?.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  );
};
