import { FC, FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentFromDbType, CommentTreeType } from "../types/comment.type";
import { useAuth } from "../context/AuthContext.hook";
import { createReplyComment } from "../api/comments";
import { QUERY_KEYS } from "../api/queryKeys";
import { ChevronDownIcon } from "../assets/icons/ChevronDownIcon";
import { ChevronUpIcon } from "../assets/icons/ChevronUpIcon";
import { UserAvatar } from "./UserAvatar";

type Props = Pick<CommentFromDbType, "post_id"> & {
  comment: CommentTreeType;
};

export const CommentItem: FC<Props> = ({ post_id, comment }) => {
  const [showReply, setShowReply] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();
  const { dbUserData } = useAuth();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) => {
      if (!dbUserData)
        throw new Error("You must be logged in to reply comment");

      return createReplyComment({
        content: replyContent,
        post_id,
        parent_comment_id: comment.id,
        user_id: dbUserData.id,
        author: dbUserData.display_name,
        avatar_url: dbUserData.avatar_url,
      });
    },
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

    mutate(replyText);
  };

  return (
    <div className="pl-4 border-l border-white/10">
      <div className="mb-2">
        <div className="flex items-center space-x-2">
          <UserAvatar avatarUrl={comment.avatar_url} />
          <span className="text-sm font-bold text-blue-400">
            {comment.author}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(comment.created_at).toLocaleString()}
        </span>

        <p className="pt-2 text-gray-300">{comment.content}</p>
        {dbUserData && (
          <button
            onClick={() => setShowReply((prev) => !prev)}
            className="text-blue-500 text-sm mt-1 transition-all hover:cursor-pointer hover:text-blue-300"
          >
            {showReply ? "Cancel" : "Reply"}
          </button>
        )}
      </div>
      {showReply && dbUserData && (
        <form onSubmit={handleReplySubmit} className="mb-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            placeholder="Write a reply..."
            rows={2}
          />
          <button
            type="submit"
            className="mt-1 bg-blue-500 text-white px-3 py-1 rounded transition-colors hover:bg-blue-600 hover:cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={isPending || !dbUserData || !replyText}
          >
            {isPending ? "Posting..." : "Post peply"}
          </button>
          {isError && <p className="text-red-500">Error posting reply.</p>}
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div>
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            title={isCollapsed ? "Hide replies" : "Show replies"}
          >
            {!isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </button>

          {!isCollapsed && (
            <div className="space-y-2">
              {comment.children.map((child, key) => (
                <CommentItem key={key} comment={child} post_id={post_id} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
