import { FC, FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentFromDbType, CommentTreeType } from "../types/comment.type";
import { supabaseClient } from "../supabase-client";
import { useAuth } from "../context/AuthContext.hook";

type Props = Pick<CommentFromDbType, "post_id"> & {
  comment: CommentTreeType;
};

const createReplyComment = async (
  content: string,
  post_id: number,
  parent_comment_id: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author)
    throw new Error("You must be logged in to reply comment");

  const { error } = await supabaseClient.from("comments").insert({
    post_id,
    content,
    parent_comment_id,
    user_id: userId,
    author,
  });

  if (error) throw new Error(error.message);
};

export const CommentItem: FC<Props> = ({ post_id, comment }) => {
  const [showReply, setShowReply] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) => {
      return createReplyComment(
        replyContent,
        post_id,
        comment.id,
        user?.id,
        user?.user_metadata.name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post_id] });
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
          {/* Display the commenter's username */}
          <span className="text-sm font-bold text-blue-400">
            {comment.author}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-300">{comment.content}</p>
        {user && (
          <button
            onClick={() => setShowReply((prev) => !prev)}
            className="text-blue-500 text-sm mt-1"
          >
            {showReply ? "Cancel" : "Reply"}
          </button>
        )}
      </div>
      {showReply && user && (
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
            className="mt-1 bg-blue-500 text-white px-3 py-1 rounded"
          >
            {isPending ? "Posting..." : "Post Reply"}
          </button>
          {isError && <p className="text-red-500">Error posting reply.</p>}
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div>
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            title={isCollapsed ? "Hide Replies" : "Show Replies"}
          >
            {isCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            )}
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
