import { useQueryClient } from "@tanstack/react-query";
import { FC, FormEvent, useState } from "react";

import { QUERY_KEYS } from "src/api";
import { useCreateNewComment, useFetchComments } from "src/api/comments";
import { useAuth } from "src/context";
import { Button, Loader, Typography } from "src/shared/UI";
import { CommentFromDbType } from "src/types";

import { CommentItem } from "./CommentItem";
import { buildFlatCommentsTree } from "./comments.utils";

type Props = Pick<CommentFromDbType, "post_id">;

export const CommentsSection: FC<Props> = ({ post_id }) => {
  const [newCommentText, setNewCommentText] = useState("");
  const queryClient = useQueryClient();
  const { dbUserData } = useAuth();

  const { data: comments, isLoading, error } = useFetchComments(post_id);

  const { mutate, isPending, isError } = useCreateNewComment({
    user_id: dbUserData?.id,
    post_id,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.comments, post_id],
      });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!newCommentText) return;

    mutate({ content: newCommentText, parent_comment_id: null });
    setNewCommentText("");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const commentTree = comments ? buildFlatCommentsTree(comments) : [];

  return (
    <div className="mt-6">
      <Typography.Header as="h4" color="gray">
        Comments section
      </Typography.Header>

      {dbUserData ? (
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
            disabled={!newCommentText || isPending}
          >
            {isPending ? "Posting..." : "Post comment"}
          </Button>

          {isError && (
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
            <CommentItem key={comment.id} comment={comment} post_id={post_id} />
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
