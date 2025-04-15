import { FC } from "react";
import { PostFromDbType } from "../types/post.type";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { useFetchPostById } from "../api/posts";
import { Link } from "react-router";
import { Loader } from "./Loader";
import { UserAvatar } from "./UserAvatar";
import { PhotoView } from "react-photo-view";
import { NotFound } from "./NotFound";

type PostDetailsProps = {
  post_id: PostFromDbType["id"];
};

export const PostDetails: FC<PostDetailsProps> = ({ post_id }) => {
  const { data, error, isLoading } = useFetchPostById(post_id);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-4xl md:text-6xl leading-14 md:leading-20 font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data?.title}
      </h2>

      <PhotoView src={data?.image_url}>
        <img
          src={data?.image_url}
          alt={data?.title}
          className="mt-4 rounded object-cover w-full h-64"
        />
      </PhotoView>

      <p className="text-gray-400">{data?.content}</p>

      <div className="flex items-center gap-2.5">
        <UserAvatar avatarUrl={data?.author.avatar_url} size="lg" />

        <div className="flex flex-col">
          <p className="font-bold text-gray-500 text-base">
            {data?.author.display_name}
          </p>
          <p className="text-gray-500 text-sm">
            {`posted ${new Date(data!.created_at).toLocaleString()}`}
          </p>
        </div>
      </div>

      {data?.community ? (
        <Link
          to={`/community/${data.community.id}`}
          className="transition-all hover:cursor-pointer hover:text-purple-500"
        >
          #{data.community.name}
        </Link>
      ) : (
        <p className="text-gray-500 text-sm">#No community</p>
      )}

      <LikeButton post_id={post_id} />
      <CommentSection post_id={post_id} />
    </div>
  );
};
