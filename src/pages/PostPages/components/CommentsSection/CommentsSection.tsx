import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { useCreateCommentMutation, useFetchComments } from "src/api/comments";
import { COMMENT_MAX_LENGTH } from "src/constants";
import { useAuth } from "src/context";
import {
  BaseForm,
  Button,
  FormTextarea,
  Loader,
  RequiredHint,
  Typography,
  useBaseForm,
} from "src/shared/UI";
import { Comment, Post } from "src/types";

import { CommentItem } from "./CommentItem";
import { CommentFormType, getCommentFormConfig } from "./validationSchema";
import { buildFlatCommentsTree } from "../../utils/comments.utils";

type Props = Pick<Comment, "postId"> & Pick<Post, "commentCount">;

export const CommentsSection: FC<Props> = ({ postId, commentCount }) => {
  const queryClient = useQueryClient();
  const { userData } = useAuth();
  const { comments, areCommentsLoading, commentsError } =
    useFetchComments(postId);
  const { createComment, isCreateCommentLoading } = useCreateCommentMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.comments, postId],
      });
      formParams.reset();
    },
  });
  const { validationSchema, defaultValues, fullFieldName } =
    getCommentFormConfig(`main-${postId}`);
  const formParams = useBaseForm({
    validationSchema,
    defaultValues,
  });

  const handleSubmit = (formData: CommentFormType["defaultValues"]) => {
    if (!userData) return;

    toast.promise(
      async () => {
        await createComment({
          content: formData[fullFieldName],
          parentCommentId: null,
          userId: userData.id,
          postId,
        });
      },
      {
        pending: `🚀 Sending your comment!`,
        success: `Comment added successfully!`,
      }
    );
  };

  if (areCommentsLoading) {
    return <Loader />;
  }

  if (commentsError) {
    return <div>Error: {commentsError.message}</div>;
  }

  const commentValue = formParams.watch(fullFieldName);
  const commentTree = comments ? buildFlatCommentsTree(comments) : [];

  return (
    <div className="mt-6">
      <Typography.Header as="h4" color="gray">
        {`Comments (${commentCount})`}
      </Typography.Header>

      {userData ? (
        <BaseForm
          className="mb-4 flex flex-col gap-3"
          formParams={formParams}
          onSubmit={handleSubmit}
        >
          <FormTextarea
            labelText="New comment"
            name={fullFieldName}
            placeholder="Write a comment..."
            maxLength={COMMENT_MAX_LENGTH}
            showCounter
            isRequired
            rows={3}
          />

          <RequiredHint />

          <Button
            type="submit"
            className="self-end"
            disabled={!commentValue || isCreateCommentLoading}
          >
            {isCreateCommentLoading ? "Posting..." : "Post comment"}
          </Button>
        </BaseForm>
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
