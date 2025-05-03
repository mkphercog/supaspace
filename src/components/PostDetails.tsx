import MDEditor from "@uiw/react-md-editor";
import { FC } from "react";
import { PhotoView } from "react-photo-view";

import { useFetchPostById } from "src/api/posts";
import PostPlaceholderImage from "src/assets/images/postPlaceholder.jpg";
import { Card, Typography } from "src/components/ui";
import { NotFoundPage } from "src/pages/NotFoundPage";
import { ROUTES } from "src/routes";
import { PostFromDbType } from "src/types";

import { CommentsSection } from "./CommentsSection/CommentsSection";
import { LikeButton } from "./LikeButton";
import { Loader } from "./Loader";
import { UserAvatar } from "./UserAvatar";

type PostDetailsProps = {
  post_id: PostFromDbType["id"];
};

export const PostDetails: FC<PostDetailsProps> = ({ post_id }) => {
  const { data, error, isLoading } = useFetchPostById(post_id);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <NotFoundPage />;
  }

  return (
    <Card>
      <Typography.Header>{data?.title}</Typography.Header>

      <PhotoView src={data?.image_url || PostPlaceholderImage}>
        <img
          src={data?.image_url || PostPlaceholderImage}
          alt={data?.title}
          className="mt-4 rounded object-cover w-full h-64"
        />
      </PhotoView>

      <MDEditor.Markdown source={data?.content} className="bg-transparent!" />

      <div className="flex items-center gap-2.5">
        <UserAvatar avatarUrl={data?.author.avatar_url} size="lg" />

        <div className="flex flex-col">
          <Typography.Text size="lg" className="font-bold">
            {data?.author.nickname}
          </Typography.Text>
          <Typography.Text size="sm">
            {`posted ${new Date(data!.created_at).toLocaleString()}`}
          </Typography.Text>
        </div>
      </div>

      {data?.community ? (
        <Typography.Link
          to={ROUTES.community.details(data.community.id)}
          color="lime"
        >
          #{data.community.name}
        </Typography.Link>
      ) : (
        <Typography.Text className="font-bold">#No community</Typography.Text>
      )}

      <LikeButton post_id={post_id} />
      <CommentsSection post_id={post_id} />
    </Card>
  );
};
