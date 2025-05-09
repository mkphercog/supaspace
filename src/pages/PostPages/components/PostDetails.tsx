import { FC, lazy } from "react";

import { useFetchPostById } from "src/api/posts";
import { PostPlaceholderImage } from "src/assets/images";
import { SB_STORAGE } from "src/constants";
import { useAuth } from "src/context";
import { NotFoundPage } from "src/pages/NotFoundPage";
import { ROUTES } from "src/routes";
import { ImageSkeleton, UserAvatar } from "src/shared/components";
import { Card, Typography, Loader } from "src/shared/UI";
import { Post } from "src/types";
import { getFilePathToDeleteFromStorage } from "src/utils";

import { CommentsSection } from "./CommentsSection";
import { PostDeleteButton } from "./PostDeleteButton";
import { PostVoteButtons } from "./PostVoteButtons";

const MDPreview = lazy(() => import("@uiw/react-markdown-preview"));

type PostDetailsProps = {
  postId: Post["id"];
};

export const PostDetails: FC<PostDetailsProps> = ({ postId }) => {
  const { currentSession } = useAuth();
  const { postDetails, isPostDetailsLoading, postDetailsError } =
    useFetchPostById(postId);

  if (isPostDetailsLoading) {
    return <Loader />;
  }

  if (postDetailsError) {
    return <NotFoundPage />;
  }

  const postImagePathToDelete = getFilePathToDeleteFromStorage({
    storagePrefix: `${SB_STORAGE.postImages}/`,
    fullFileUrl: postDetails.imageUrl,
  });

  return (
    <Card>
      <Typography.Header>{postDetails.title}</Typography.Header>

      <ImageSkeleton
        src={postDetails.imageUrl || PostPlaceholderImage}
        alt={postDetails.title}
        className="h-[200px] md:h-[400px]"
        withPhotoView
      />

      <MDPreview source={postDetails.content} className="bg-transparent!" />

      <div className="flex items-center gap-2.5">
        <UserAvatar avatarUrl={postDetails.author.avatarUrl} size="lg" />

        <div className="flex flex-col">
          {currentSession ? (
            <Typography.Link
              to={ROUTES.profiles.details(postDetails.author.id)}
              className="self-start text-base md:text-lg font-bold hover:underline"
            >
              {postDetails.author.displayName}
            </Typography.Link>
          ) : (
            <Typography.Text size="lg" className="font-bold">
              {postDetails.author.displayName}
            </Typography.Text>
          )}
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
