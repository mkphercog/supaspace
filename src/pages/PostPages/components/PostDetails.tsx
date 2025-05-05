import MDEditor from "@uiw/react-md-editor";
import { FC } from "react";
import { PhotoView } from "react-photo-view";

import { useFetchPostById } from "src/api/posts";
import { PostPlaceholderImage } from "src/assets/images";
import { NotFoundPage } from "src/pages/NotFoundPage";
import { ROUTES } from "src/routes";
import { UserAvatar } from "src/shared/components";
import { Card, Typography, Loader } from "src/shared/UI";
import { Post } from "src/types";
import { getFilePathToDeleteFromStorage } from "src/utils";

import { CommentsSection } from "./CommentsSection";
import { PostDeleteButton } from "./PostDeleteButton";
import { PostVoteButtons } from "./PostVoteButtons";

type PostDetailsProps = {
  postId: Post["id"];
};

export const PostDetails: FC<PostDetailsProps> = ({ postId }) => {
  const { postDetails, isPostDetailsLoading, postDetailsError } =
    useFetchPostById(postId);

  if (isPostDetailsLoading) {
    return <Loader />;
  }

  if (postDetailsError) {
    return <NotFoundPage />;
  }

  const postImagePathToDelete = getFilePathToDeleteFromStorage({
    storagePrefix: "post-images/",
    fullFileUrl: postDetails.imageUrl,
  });

  return (
    <Card>
      <Typography.Header>{postDetails.title}</Typography.Header>

      <PhotoView src={postDetails.imageUrl || PostPlaceholderImage}>
        <img
          src={postDetails.imageUrl || PostPlaceholderImage}
          alt={postDetails.title}
          className="mt-4 rounded object-cover w-full h-64"
        />
      </PhotoView>

      <MDEditor.Markdown
        source={postDetails.content}
        className="bg-transparent!"
      />

      <div className="flex items-center gap-2.5">
        <UserAvatar avatarUrl={postDetails.author.avatarUrl} size="lg" />

        <div className="flex flex-col">
          <Typography.Text size="lg" className="font-bold">
            {postDetails.author.nickname}
          </Typography.Text>
          <Typography.Text size="sm">
            {`posted ${new Date(postDetails.createdAt).toLocaleString()}`}
          </Typography.Text>
        </div>
      </div>

      {postDetails?.community ? (
        <Typography.Link
          to={ROUTES.community.details(postDetails.community.id)}
          color="lime"
        >
          #{postDetails.community.name}
        </Typography.Link>
      ) : (
        <Typography.Text className="font-bold">#No community</Typography.Text>
      )}

      <PostVoteButtons postId={postId} />
      <PostDeleteButton
        postId={postId}
        authorId={postDetails.author.id}
        postImagePathToDelete={postImagePathToDelete}
      />
      <CommentsSection postId={postId} />
    </Card>
  );
};
