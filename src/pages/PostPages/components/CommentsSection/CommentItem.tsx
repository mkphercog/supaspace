import cn from "classnames";
import { FC, lazy, useState } from "react";

import { useCreateCommentReaction } from "src/api/commentReactions";
import { useAuth } from "src/context";
import { ROUTES } from "src/routes";
import { UserAvatar } from "src/shared/components";
import { Loader, Typography } from "src/shared/UI";
import { Comment, CommentTreeType, Reaction, UserData } from "src/types";

import { CommentReactions } from "./CommentReactions";
import { CommentReplies } from "./CommentReplies";
import { DeleteButton } from "./DeleteButton";
import { ReactionsSummary } from "./ReactionsSummary";
import { ReplyForm } from "./ReplyForm";
import { ReplyFormTrigger } from "./ReplyFormTrigger";
const MDPreview = lazy(() => import("@uiw/react-markdown-preview"));

type Props = Pick<Comment, "postId"> & {
  comment: CommentTreeType;
  goToParam: string | null;
};

export const CommentItem: FC<Props> = ({ postId, comment, goToParam }) => {
  const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
  const { userData, currentSession } = useAuth();
  const { createCommentReaction, isCreateCommentReactionLoading } =
    useCreateCommentReaction(postId, comment.id);

  const toggleReplyFormVisibility = () => {
    setIsReplyFormVisible((prev) => !prev);
  };

  const isParentComment = comment.parentCommentId === null;
  const authorDisplayName = comment.author.displayName;
  const goToId = !isParentComment
    ? `comment-reply-${comment.id}`
    : `comment-${comment.id}`;
  const isHighlight =
    goToParam?.replace(!isParentComment ? "comment-reply-" : "comment-", "") ===
      comment.id.toString() ||
    goToParam === `reaction-to-comment-${comment.id}`;

  const handleCreateReaction = async (
    userId: UserData["id"],
    reaction: Reaction
  ) => {
    await createCommentReaction({
      userId,
      reaction,
    });
  };

  return (
    <section
      data-go-to={goToId}
      className={cn("relative p-2 rounded-xl", {
        "bg-gray-700/20": isParentComment,
        "bg-transparent": !isParentComment,
      })}
    >
      {isCreateCommentReactionLoading && (
        <Loader
          className={cn(
            "absolute top-0 bottom-0 left-0 right-0",
            "bg-[rgba(12,13,15,0.88)] rounded-xl z-50"
          )}
        />
      )}

      <main
        className={cn(
          "grid grid-cols-[auto_1fr_auto] grid-rows-[repeat(5,auto)]",
          "p-2 bg-gray-500/20 rounded-2xl",
          { "animate-pulse": isHighlight }
        )}
      >
        <UserAvatar
          className="row-span-3 row-start-1 mr-2"
          avatarUrl={comment.author.avatarUrl}
          size="md"
        />

        {currentSession ? (
          <Typography.Link
            to={ROUTES.profiles.details(comment.author.id)}
            className="col-start-2 justify-self-start font-bold text-blue-400! hover:text-blue-500!"
          >
            {authorDisplayName}
          </Typography.Link>
        ) : (
          <Typography.Text
            size="sm"
            className="col-start-2 justify-self-start font-bold text-blue-400!"
          >
            {authorDisplayName}
          </Typography.Text>
        )}

        <DeleteButton
          postId={postId}
          commentId={comment.id}
          ownerId={comment.author.id}
        />

        <MDPreview
          source={comment.content}
          className="col-span-2 col-start-2 row-start-2 pl-1 bg-transparent!"
        />

        <Typography.Text
          size="xxs"
          className="col-span-3 row-start-3 justify-self-end text-gray-500"
        >
          {new Date(comment.createdAt).toLocaleString()}
        </Typography.Text>

        {(comment.reactions.length !== 0 || userData) && (
          <hr className="col-span-3 row-start-4 text-gray-500" />
        )}

        <div
          className={cn(
            "col-span-3 col-start-1 row-start-5 mt-1",
            "relative grid grid-cols-[auto_1fr_auto] gap-2"
          )}
        >
          <ReactionsSummary postId={postId} comment={comment} />

          <ReplyFormTrigger
            isReplyFormVisible={isReplyFormVisible}
            toggleReplyFormVisibility={toggleReplyFormVisibility}
          />

          <CommentReactions
            reactions={comment.reactions}
            handleCreateReaction={handleCreateReaction}
            isCreateCommentReactionLoading={isCreateCommentReactionLoading}
          />
        </div>
      </main>

      <ReplyForm
        commentId={comment.id}
        postId={postId}
        isReplyFormVisible={isReplyFormVisible}
        parentCommentAuthorId={comment.author.id}
      />

      <CommentReplies
        postId={postId}
        comment={comment}
        goToParam={goToParam}
        forceExpanded={
          !!comment.children.find(
            (comment) =>
              goToParam === `comment-reply-${comment.id}` ||
              goToParam === `reaction-to-comment-${comment.id}`
          )
        }
      />
    </section>
  );
};
