import { useQuery } from "@tanstack/react-query";
import { PostItem } from "./PostItem";
import { PostFromDbType } from "../types/post.type";
import { fetchPosts } from "../api/posts";
import { QUERY_KEYS } from "../api/queryKeys";
import { Loader } from "./Loader";

export const PostList = () => {
  const { data, error, isLoading } = useQuery<PostFromDbType[], Error>({
    queryKey: [QUERY_KEYS.posts],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ul className="flex flex-wrap gap-6 justify-center">
      {data?.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  );
};
