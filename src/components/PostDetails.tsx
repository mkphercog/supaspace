import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { PostDetailsFromDbType, PostFromDbType } from "../types/post.type";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { fetchPostById } from "../api/posts";
import { QUERY_KEYS } from "../api/queryKeys";
import { Link } from "react-router";
import { Loader } from "./Loader";

type PostDetailsProps = {
  post_id: PostFromDbType["id"];
};

export const PostDetails: FC<PostDetailsProps> = ({ post_id }) => {
  const { data, error, isLoading } = useQuery<PostDetailsFromDbType, Error>({
    queryKey: [QUERY_KEYS.post, post_id],
    queryFn: () => fetchPostById(post_id),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-4xl md:text-6xl leading-14 md:leading-20 font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
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

      <div className="flex items-center gap-2.5">
        {data?.avatar_url ? (
          <img
            src={data.avatar_url}
            alt="User Avatar"
            className="w-[35px] h-[35px] rounded-full object-cover"
          />
        ) : (
          <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
        )}

        <p className="text-gray-500 text-sm">
          {`posted ${new Date(data!.created_at).toLocaleString()}`}
        </p>
      </div>

      {data?.communities ? (
        <Link
          to={`/community/${data.community_id}`}
          className="transition-all hover:cursor-pointer hover:text-purple-500"
        >
          #{data.communities.name}
        </Link>
      ) : (
        <p className="text-gray-500 text-sm">#No community</p>
      )}

      <LikeButton post_id={post_id} />
      <CommentSection post_id={post_id} />
    </div>
  );
};
