import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "../supabase-client";
import { PostItem } from "./PostItem";
import { PostFromDbType } from "../types/post.type";

const fetchPosts = async (): Promise<PostFromDbType[]> => {
  const { data, error } = await supabaseClient.rpc("get_posts_with_counts");

  if (error) {
    throw new Error(error.message);
  }

  return data as PostFromDbType[];
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<PostFromDbType[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <div>Loading posts...</div>;
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
