import { useQueryClient } from "@tanstack/react-query";
import { FC, lazy, useState } from "react";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import {
  useCreateCommentMutation,
  useDeleteCommentsMutation,
} from "src/api/comments";
import { ChevronUpIcon } from "src/assets/icons";
import { COMMENT_MAX_LENGTH } from "src/constants";
import { useAuth } from "src/context";
import { useDeleteWarnToast } from "src/hooks";
import { ROUTES } from "src/routes";
import { UserAvatar } from "src/shared/components";
import {
  BaseForm,
  Button,
  FormTextarea,
  RequiredHint,
  Typography,
  useBaseForm,
} from "src/shared/UI";
import { Comment, CommentTreeType } from "src/types";

import { getReplyStyleColor } from "./comments.utils";
import {
  CommentFormType,
  INITIAL_FORM_STATE,
  validationSchema,
} from "./validationSchema";

const MDPreview = lazy(() => import("@uiw/react-markdown-preview"));

type Props = Pick<Comment, "postId"> & {
  comment: CommentTreeType;
};

export const CommentItem: FC<Props> = ({ postId, comment }) => {
  const [showReply, setShowReply] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const queryClient = useQueryClient();
  const { userData, currentSession } = useAuth();
  const formParams = useBaseForm({
    validationSchema,
    defaultValues: INITIAL_FORM_STATE,
  });
  const { deleteComment } = useDeleteCommentsMutation(postId);
  const { startDeletingProcess } = useDeleteWarnToast({
    subjectName: "Comment",
    realDeleteFn: async () => {
      if (!userData) return;

      await deleteComment({
        id: comment.id,
      });
    },
  });

  const { createComment, isCreateCommentLoading } = useCreateCommentMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.comments, postId],
      });
      formParams.reset();
    },
  });

  const handleSubmit = ({ commentContent }: CommentFormType) => {
    if (!userData) return;

    toast.promise(
      async () => {
        await createComment({
          content: commentContent,
          parentCommentId: comment.id,
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

  const commentValue = formParams.watch("commentContent");
  const isParentComment = comment.parentCommentId === null;
  const childrenCommentsGroupedByReplyStyle = Object.values(
    comment.children.reduce((acc, child) => {
      const key = child.replyStyle;
      if (!acc[key]) acc[key] = [];
      acc[key].push(child);
      return acc;
    }, {} as Record<number, CommentTreeType[]>)
  );

  return (
    <div
      className={`
        w-full p-2 rounded-xl
        ${isParentComment ? "bg-gray-700/20" : "bg-transparent"} 
      `}
    >
      <div
        className={`
          flex gap-2 p-2
          bg-gray-500/20 rounded-xl
        `}
      >
        <UserAvatar avatarUrl={comment.author.avatarUrl} size="md" />
        <div className={`grow flex flex-col gap-1 rounded-xl`}>
          {currentSession ? (
            <Typography.Link
              to={ROUTES.profiles.details(comment.author.id)}
              className="self-start font-bold text-blue-400! hover:underline"
            >
              {comment.author.displayName}
            </Typography.Link>
          ) : (
            <Typography.Text size="sm" className="font-bold text-blue-400!">
              {comment.author.displayName}
            </Typography.Text>
          )}

          <MDPreview
            source={comment.content}
            className="pl-1 bg-transparent!"
          />

          <Typography.Text size="xxs" className="self-end text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </Typography.Text>

          {userData && <hr className="text-gray-500" />}
          <div className="self-end">
            {userData && (
              <Button
                onClick={() => setShowReply((prev) => !prev)}
                variant="ghost"
                className="col-span-2 justify-self-end text-blue-500!"
              >
                <Typography.Text size="sm" className="text-inherit">
                  {showReply ? "Cancel" : "Reply"}
                </Typography.Text>
              </Button>
            )}

            {userData?.id === comment.userId && (
              <Button
                className="self-end"
                variant="ghost"
                onClick={startDeletingProcess}
              >
                <Typography.Text size="xs" color="red">
                  Delete
                </Typography.Text>
              </Button>
            )}
          </div>
        </div>
      </div>

      {showReply && userData && (
        <BaseForm
          className="flex flex-col mt-2 gap-3"
          formParams={formParams}
          onSubmit={handleSubmit}
        >
          <FormTextarea
            labelText="Reply comment"
            name={"commentContent"}
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
      )}

      {comment.children && comment.children.length > 0 && (
        <div className="mt-1">
          <Button
            className="flex items-center gap-1 mb-1 text-purple-400"
            variant="ghost"
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            <ChevronUpIcon className={`${isCollapsed ? "rotate-180" : ""}`} />
            <Typography.Text size="xs" className="text-inherit">
              {`${isCollapsed ? "Show replies" : "Hide replies"} (${
                comment.children.length
              })`}
            </Typography.Text>
          </Button>

          {!isCollapsed && (
            <div className="flex flex-col items-end w-full">
              {childrenCommentsGroupedByReplyStyle.map(
                (groupedChildrens, key) => {
                  const firstChildReplyStyle = groupedChildrens[0].replyStyle;
                  return (
                    <div
                      key={key}
                      className={`
                        mt-5 w-full
                        rounded-xl border
                        ${getReplyStyleColor(firstChildReplyStyle)}
                      `}
                    >
                      {groupedChildrens.map((child) => (
                        <CommentItem
                          key={child.id}
                          comment={child}
                          postId={postId}
                        />
                      ))}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
