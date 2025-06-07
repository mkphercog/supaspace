import { FC, lazy, useEffect } from "react";
import { useSearchParams } from "react-router";
import TimeAgo from "react-timeago";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import enStrings from "react-timeago/lib/language-strings/en";
import { toast } from "react-toastify";

import { useCreatePostReaction, useFetchPostById } from "src/api/posts";
import { SB_STORAGE } from "src/constants";
import { useAuth } from "src/context";
import { useScreenSize } from "src/hooks";
import { NotFoundPage } from "src/pages/NotFoundPage";
import { ROUTES } from "src/routes";
import { ImageSkeleton, UserAvatar } from "src/shared/components";
import { Card, Typography, Loader, Button } from "src/shared/UI";
import { Post, Reaction, UserData } from "src/types";
import { getFilePathToDeleteFromStorage } from "src/utils";

import { CommentsSection } from "./CommentsSection";
import { PostBreadcrumbs } from "./PostBreadcrumbs";
import { PostDeleteButton } from "./PostDeleteButton";
import { PostReactions } from "./PostReactions";
const MDPreview = lazy(() => import("@uiw/react-markdown-preview"));

const formatter = buildFormatter(enStrings);

type PostDetailsProps = {
  postId: Post["id"];
};

export const PostDetails: FC<PostDetailsProps> = ({ postId }) => {
  const [searchParams] = useSearchParams();
  const goToElId = searchParams.get("goTo");

  const { isMdUp } = useScreenSize();
  const { currentSession } = useAuth();
  const { postDetails, isPostDetailsLoading, postDetailsError } =
    useFetchPostById(postId);
  const { createPostReaction, isCreatePostReactionLoading } =
    useCreatePostReaction(postId);

  useEffect(() => {
    if (!goToElId) return;

    const timeout = setTimeout(() => {
      const scrollContainer = document.getElementById("scrollable-container");
      const el = document.querySelector(`[data-go-to="${goToElId}"]`);
      if (scrollContainer && el instanceof HTMLElement) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        const offsetTop =
          elRect.top - containerRect.top + scrollContainer.scrollTop;
        const targetScrollTop =
          offsetTop - scrollContainer.clientHeight + el.offsetHeight + 24;

        scrollContainer.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [goToElId]);

  if (isPostDetailsLoading) {
    return <Loader />;
  }

  if (postDetailsError) {
    return <NotFoundPage />;
  }

  const handleCreateReaction = async (
    userId: UserData["id"],
    reaction: Reaction
  ) => {
    await createPostReaction({
      userId,
      reaction,
    });
  };

  const postImagePathToDelete = getFilePathToDeleteFromStorage({
    storagePrefix: `${SB_STORAGE.postImages}/`,
    fullFileUrl: postDetails.imageUrl,
  });

  const handleCopyPostLink = () => {
    const link = `${window.location.origin}${ROUTES.post.root()}/${postId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Link copied!");
      })
      .catch((error) => {
        toast.warn("Failed to copy:", error);
      });
  };

  return (
    <Card>
      <div className="flex gap-2 items-center justify-start mb-2">
        <PostBreadcrumbs
          title={postDetails.title}
          community={postDetails.community}
        />

        <PostDeleteButton
          postId={postId}
          authorId={postDetails.author.id}
          postImagePathToDelete={postImagePathToDelete}
        />
      </div>

      <ImageSkeleton
        src={postDetails.imageUrl}
        alt={postDetails.title}
        className="aspect-[2.35/1]"
        withPhotoView
      />

      <div className="flex ">
        <Typography.Link
          to={ROUTES.community.details(postDetails.community.id)}
          color="lime"
          className="hover:text-lime-500!"
          size="lg"
        >
          #{postDetails.community.name}
        </Typography.Link>

        <Button
          onClick={handleCopyPostLink}
          className="shrink-0 ml-auto"
          variant="outline"
        >
          <Typography.Text size="sm">Copy link</Typography.Text>
        </Button>
      </div>

      <Typography.Header as={isMdUp ? "h2" : "h3"} className="mt-5">
        {postDetails.title}
      </Typography.Header>

      <MDPreview source={postDetails.content} className="bg-transparent!" />

      <Card
        className="mt-4 w-fit"
        containerClassName="gap-3"
        shadowVariant="noColors"
        containerVariant="purple"
      >
        <div className="flex items-center gap-2.5">
          <UserAvatar avatarUrl={postDetails.author.avatarUrl} size="lg" />

          <div className="flex flex-col">
            {currentSession ? (
              <Typography.Link
                to={ROUTES.profiles.details(postDetails.author.id)}
                className="self-start text-base md:text-lg font-bold"
              >
                {postDetails.author.displayName}
              </Typography.Link>
            ) : (
              <Typography.Text size="lg" className="font-bold">
                {postDetails.author.displayName}
              </Typography.Text>
            )}

            <Typography.Text size="sm" color="blue">
              {postDetails.author.role}
            </Typography.Text>
          </div>
        </div>
        <Typography.Text size="sm" color="amber">
          Posted{" "}
          <TimeAgo
            title={`Posted: ${new Date(
              postDetails.createdAt
            ).toLocaleString()}`}
            date={postDetails.createdAt}
            formatter={formatter}
          />
        </Typography.Text>
      </Card>

      <PostReactions
        reactions={postDetails.reactions}
        handleCreateReaction={handleCreateReaction}
        isCreatePostReactionLoading={isCreatePostReactionLoading}
      />

      <CommentsSection
        postId={postId}
        commentCount={postDetails.commentCount}
      />
    </Card>
  );
};
