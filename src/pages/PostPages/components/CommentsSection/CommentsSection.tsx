import { useQueryClient } from "@tanstack/react-query";
import { FC, FormEvent, useState } from "react";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { useCreateCommentMutation, useFetchComments } from "src/api/comments";
import { useAuth } from "src/context";
import { Button, Loader, Typography } from "src/shared/UI";
import { Comment } from "src/types";

import { CommentItem } from "./CommentItem";
import { buildFlatCommentsTree } from "./comments.utils";

type Props = Pick<Comment, "postId">;

export const CommentsSection: FC<Props> = ({ postId }) => {
  const [newCommentText, setNewCommentText] = useState("");
  const queryClient = useQueryClient();
  const { userData } = useAuth();

  const { comments, areCommentsLoading, commentsError } =
    useFetchComments(postId);

  const { createComment, createCommentError, isCreateCommentLoading } =
    useCreateCommentMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.comments, postId],
        });
      },
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!newCommentText || !userData) return;

    toast
      .promise(
        async () => {
          await createComment({
            content: newCommentText,
            parentCommentId: null,
            userId: userData.id,
            postId,
          });
        },
        {
          pending: `🚀 Sending your comment!`,
          success: `Comment added successfully!`,
        }
      )
      .then(() => {
        setNewCommentText("");
      });
  };

  if (areCommentsLoading) {
    return <Loader />;
  }

  if (commentsError) {
    return <div>Error: {commentsError.message}</div>;
  }

  const commentTree = comments ? buildFlatCommentsTree(comments) : [];

  return (
    <div className="mt-6">
      <Typography.Header as="h4" color="gray">
        Comments section
      </Typography.Header>

      {userData ? (
        <form className="mb-4 flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="commentContent" className="block mb-1 font-medium">
              New comment
            </label>
            <textarea
              id="commentContent"
              name="commentContent"
              className={`
                w-full text-sm rounded-md p-2 block         
                border border-gray-500 hover:border-purple-600 focus:outline-none
                bg-transparent focus:border-purple-600
                transition-colors duration-300
                hover:cursor-text
              `}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
            />
          </div>
          <Button
            type="submit"
            className="self-end"
            disabled={!newCommentText || isCreateCommentLoading}
          >
            {isCreateCommentLoading ? "Posting..." : "Post comment"}
          </Button>

          {createCommentError && (
            <Typography.Text className="mt-2" color="red">
              Error posting comment.
            </Typography.Text>
          )}
        </form>
      ) : (
        <Typography.Text size="lg" className="mb-4 text-center" color="purple">
          You must be logged in to post a comment.
        </Typography.Text>
      )}

      {commentTree.length ? (
        <div className="space-y-8">
          {commentTree?.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      ) : (
        <Typography.Text color="purple" className="text-center">
          No comments yet.
        </Typography.Text>
      )}
    </div>
  );
};
