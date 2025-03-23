import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "../supabase-client";
import { PostItem } from "./PostItem";

export type PostType = {
  id: number;
  created_at: string;
  title: string;
  content: string;
  image_url: string;
  avatar_url: string;
  like_count: number;
  comment_count: number;
};

const fetchPosts = async (): Promise<PostType[]> => {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as PostType[];
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<PostType[], Error>({
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
        <PostItem key={post.id} {...post} />
      ))}
    </ul>
  );
};
