import { FC } from "react";
import { PhotoView } from "react-photo-view";
import MDEditor from "@uiw/react-md-editor";
import { PostFromDbType } from "../types/post.type";
import { useFetchPostById } from "../api/posts";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { Loader } from "./Loader";
import { UserAvatar } from "./UserAvatar";
import { NotFound } from "./NotFound";
import { Typography } from "./ui";
import PostPlaceholderImage from "../assets/images/postPlaceholder.jpg";

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
    <div className="space-y-6 max-w-5xl mx-auto">
      <Typography.Header>{data?.title}</Typography.Header>

      <PhotoView src={data?.image_url || PostPlaceholderImage}>
        <img
          src={data?.image_url || PostPlaceholderImage}
          alt={data?.title}
          className="mt-4 rounded object-cover w-full h-64"
        />
      </PhotoView>

      <MDEditor.Markdown
        source={data?.content}
        className="p-3 bg-transparent!"
      />

      <div className="flex items-center gap-2.5">
        <UserAvatar avatarUrl={data?.author.avatar_url} size="lg" />

        <div className="flex flex-col">
          <Typography.Text size="lg" className="font-bold">
            {data?.author.display_name}
          </Typography.Text>
          <Typography.Text size="sm">
            {`posted ${new Date(data!.created_at).toLocaleString()}`}
          </Typography.Text>
        </div>
      </div>

      {data?.community ? (
        <Typography.Link to={`/community/${data.community.id}`} color="lime">
          #{data.community.name}
        </Typography.Link>
      ) : (
        <Typography.Text className="font-bold">#No community</Typography.Text>
      )}

      <LikeButton post_id={post_id} />
      <CommentSection post_id={post_id} />
    </div>
  );
};
