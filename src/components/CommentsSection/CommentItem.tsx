import { useQueryClient } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import { FC, FormEvent, useState } from "react";

import { QUERY_KEYS } from "src/api";
import {
  useCreateNewComment,
  useDeleteCommentsMutation,
} from "src/api/comments";
import { ChevronUpIcon } from "src/assets/icons";
import { Button, Typography } from "src/components/ui";
import { useAuth } from "src/context";
import { useDeleteWarnToast } from "src/hooks";
import { CommentFromDbType, CommentTreeType } from "src/types";

import { getReplyStyleColor } from "./comments.utils";
import { UserAvatar } from "../UserAvatar";

type Props = Pick<CommentFromDbType, "post_id"> & {
  comment: CommentTreeType;
};

export const CommentItem: FC<Props> = ({ post_id, comment }) => {
  const [showReply, setShowReply] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();
  const { dbUserData } = useAuth();

  const { deleteComment } = useDeleteCommentsMutation(post_id);
  const { startDeletingProcess } = useDeleteWarnToast({
    subjectName: "Comment",
    realDeleteFn: async () => {
      if (!dbUserData) return;

      await deleteComment({
        commentId: comment.id,
      });
    },
  });

  const {
    mutate: createReplyCommentMutation,
    isPending,
    isError,
  } = useCreateNewComment({
    user_id: dbUserData?.id,
    post_id,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.comments, post_id],
      });
      setReplyText("");
      setShowReply(false);
    },
  });

  const handleReplySubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!replyText) return;

    createReplyCommentMutation({
      content: replyText,
      parent_comment_id: comment.id,
    });
  };

  const isParentComment = comment.parent_comment_id === null;
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
        <UserAvatar avatarUrl={comment.author.avatar_url} size="md" />
        <div className={`grow flex flex-col gap-1 rounded-xl`}>
          <Typography.Text size="sm" className="font-bold text-blue-400!">
            {comment.author.nickname}
          </Typography.Text>

          <MDEditor.Markdown
            source={comment.content}
            className="pl-1 bg-transparent!"
          />

          <Typography.Text size="xxs" className="self-end text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </Typography.Text>

          {dbUserData && <hr className="text-gray-500" />}
          <div className="self-end">
            {dbUserData && (
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

            {dbUserData?.id === comment.user_id && (
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

      {showReply && dbUserData && (
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
            disabled={isPending || !dbUserData || !replyText}
          >
            {isPending ? "Posting..." : "Post reply"}
          </Button>

          {isError && (
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
                          post_id={post_id}
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
