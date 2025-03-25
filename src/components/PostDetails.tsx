import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { PostFromDbType } from "../types/post.type";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { fetchPostById } from "../api/posts";
import { QUERY_KEYS } from "../api/queryKeys";

type PostDetailsProps = {
  post_id: PostFromDbType["id"];
};

export const PostDetails: FC<PostDetailsProps> = ({ post_id }) => {
  const { data, error, isLoading } = useQuery<PostFromDbType, Error>({
    queryKey: [QUERY_KEYS.post, post_id],
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
