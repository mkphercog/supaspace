import { useQueryClient } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import { FC, FormEvent, useState } from "react";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import {
  useCreateCommentMutation,
  useDeleteCommentsMutation,
} from "src/api/comments";
import { ChevronUpIcon } from "src/assets/icons";
import { useAuth } from "src/context";
import { useDeleteWarnToast } from "src/hooks";
import { UserAvatar } from "src/shared/components";
import { Button, Typography } from "src/shared/UI";
import { Comment, CommentTreeType } from "src/types";

import { getReplyStyleColor } from "./comments.utils";

type Props = Pick<Comment, "postId"> & {
  comment: CommentTreeType;
};

export const CommentItem: FC<Props> = ({ postId, comment }) => {
  const [showReply, setShowReply] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();
  const { userData } = useAuth();

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

  const { createComment, isCreateCommentLoading, createCommentError } =
    useCreateCommentMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.comments, postId],
        });
        setReplyText("");
        setShowReply(false);
      },
    });

  const handleReplySubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!replyText || !userData) return;

    toast.promise(
      async () => {
        await createComment({
          userId: userData.id,
          postId,
          content: replyText,
          parentCommentId: comment.id,
        });
      },
      {
        pending: `🚀 Sending your comment!`,
        success: `Comment added successfully!`,
      }
    );
  };

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
          <Typography.Text size="sm" className="font-bold text-blue-400!">
            {comment.author.nickname}
          </Typography.Text>

          <MDEditor.Markdown
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
        <form onSubmit={handleReplySubmit} className="flex flex-col mt-2 gap-3">
          <textarea
            id={`commentReplyTo-${comment.id}`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className={`
                w-full text-sm rounded-md p-2 block         
                border border-gray-500 hover:border-purple-600 focus:outline-none
                bg-transparent focus:border-purple-600
                transition-colors duration-300
                hover:cursor-text
              `}
            placeholder="Write a reply..."
            rows={3}
          />
          <Button
            type="submit"
            className="self-end"
            disabled={isCreateCommentLoading || !userData || !replyText}
          >
            {isCreateCommentLoading ? "Posting..." : "Post reply"}
          </Button>

          {createCommentError && (
            <Typography.Text color="red">Error posting reply.</Typography.Text>
          )}
        </form>
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
