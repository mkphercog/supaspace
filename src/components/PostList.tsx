import { useQuery } from "@tanstack/react-query";
import { PostItem } from "./PostItem";
import { PostListItemFromDbType } from "../types/post.type";
import { fetchPosts } from "../api/posts";
import { QUERY_KEYS } from "../api/queryKeys";
import { Loader } from "./Loader";

export const PostList = () => {
  const { data, error, isLoading } = useQuery<PostListItemFromDbType[], Error>({
    queryKey: [QUERY_KEYS.posts],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data?.length) {
    return (
      <p className="text-md text-center text-gray-300 mt-2">No posts found</p>
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
