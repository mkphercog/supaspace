import { useQuery } from "@tanstack/react-query";
import { FC } from "react";

import { supabaseClient } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { PostFromDbType } from "../types/post.type";

type PostDetailsProps = {
  post_id: PostFromDbType["id"];
};

const fetchPostById = async (postId: number): Promise<PostFromDbType> => {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PostFromDbType;
};

export const PostDetails: FC<PostDetailsProps> = ({ post_id }) => {
  const { data, error, isLoading } = useQuery<PostFromDbType, Error>({
    queryKey: ["post", post_id],
    queryFn: () => fetchPostById(post_id),
  });

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data?.title}
      </h2>
      {data?.image_url && (
        <img
          src={data.image_url}
          alt={data?.title}
          className="mt-4 rounded object-cover w-full h-64"
        />
      )}
      <p className="text-gray-400">{data?.content}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!.created_at).toLocaleString()}
      </p>

      <LikeButton post_id={post_id} />
      <CommentSection post_id={post_id} />
    </div>
  );
};
