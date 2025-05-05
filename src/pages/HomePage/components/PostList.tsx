import { useFetchPosts } from "src/api/posts";
import { NotFoundPage } from "src/pages/NotFoundPage";
import { PostItem } from "src/shared/components";
import { Loader } from "src/shared/UI";

export const PostList = () => {
  const { posts, arePostsLoading, postsError } = useFetchPosts();

  if (arePostsLoading) {
    return <Loader />;
  }

  if (!posts?.length || postsError) {
    return <NotFoundPage />;
  }

  return (
    <ul className="flex flex-wrap gap-6 justify-center">
      {posts?.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  );
};
