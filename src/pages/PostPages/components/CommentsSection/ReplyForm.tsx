import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { useCreateCommentMutation } from "src/api/comments";
import { COMMENT_MAX_LENGTH } from "src/constants";
import { useAuth } from "src/context";
import {
  BaseForm,
  Button,
  FormTextarea,
  RequiredHint,
  useBaseForm,
} from "src/shared/UI";
import { Comment, Post } from "src/types";

import { CommentFormType, getCommentFormConfig } from "./validationSchema";

type Props = {
  postId: Post["id"];
  commentId: Comment["id"];
  isReplyFormVisible: boolean;
};

export const ReplyForm: FC<Props> = ({
  postId,
  commentId,
  isReplyFormVisible,
}) => {
  const { userData } = useAuth();
  const queryClient = useQueryClient();
  const { validationSchema, defaultValues, fullFieldName } =
    getCommentFormConfig(`reply-${commentId}`);
  const formParams = useBaseForm({
    validationSchema,
    defaultValues,
  });
  const { createComment, isCreateCommentLoading } = useCreateCommentMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.comments, postId],
      });
      formParams.reset();
    },
  });

  if (!userData || !isReplyFormVisible) return null;

  const handleSubmit = (formData: CommentFormType["defaultValues"]) => {
    toast.promise(
      async () => {
        await createComment({
          content: formData[fullFieldName],
          parentCommentId: commentId,
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

  const commentValue = formParams.watch(fullFieldName);

  return (
    <BaseForm
      className="flex flex-col mt-2 gap-3"
      formParams={formParams}
      onSubmit={handleSubmit}
    >
      <FormTextarea
        labelText="Reply comment"
        name={fullFieldName}
        placeholder="Write a reply comment..."
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
        {isCreateCommentLoading ? "Posting..." : "Post reply"}
      </Button>
    </BaseForm>
  );
};
