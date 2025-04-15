import { FC, FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CommentFromDbType, CommentTreeType } from "../types/comment.type";
import { useAuth } from "../context/AuthContext.hook";
import { useCreateNewComment, useDeleteComments } from "../api/comments";
import { QUERY_KEYS } from "../api/queryKeys";
import { ChevronDownIcon } from "../assets/icons/ChevronDownIcon";
import { ChevronUpIcon } from "../assets/icons/ChevronUpIcon";
import { UserAvatar } from "./UserAvatar";

type Props = Pick<CommentFromDbType, "post_id"> & {
  comment: CommentTreeType;
};

export const CommentItem: FC<Props> = ({ post_id, comment }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();
  const { dbUserData } = useAuth();

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

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

  const { mutate: deleteCommentMutation } = useDeleteComments({
    id: comment.id,
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

  const handleDeleteComment = () => {
    deleteCommentMutation();
  };

  return (
    <>
      <div className="p-2 pl-4 bg-gray-700/20 rounded-xl">
        <div className="grid gap-3 grid-cols-[auto_1fr] grid-rows-[auto_1fr] mb-2">
          <UserAvatar avatarUrl={comment.author.avatar_url} size="md" />
          <div className="flex flex-col bg-gray-600/20 p-2 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-blue-400">
                {comment.author.display_name}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-300">{comment.content}</p>
            {dbUserData?.id === comment.user_id && (
              <button
                className="self-end text-red-400 text-sm transition-all hover:cursor-pointer hover:text-red-500"
                onClick={openDialog}
              >
                Delete
              </button>
            )}
          </div>

          {dbUserData && (
            <button
              onClick={() => setShowReply((prev) => !prev)}
              className="mt-1 col-span-2 justify-self-start text-blue-500 text-sm transition-all hover:cursor-pointer hover:text-blue-300"
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
              {isPending ? "Posting..." : "Post reply"}
            </button>
            {isError && <p className="text-red-500">Error posting reply.</p>}
          </form>
        )}

        {comment.children && comment.children.length > 0 && (
          <div>
            <button
              className="flex gap-2 mb-2 transition-all hover:cursor-pointer hover:text-purple-500"
              onClick={() => setIsCollapsed((prev) => !prev)}
              title={isCollapsed ? "Hide replies" : "Show replies"}
            >
              {!isCollapsed ? (
                <>
                  <ChevronDownIcon /> <p className="text-xs">Hide replies</p>
                </>
              ) : (
                <>
                  <ChevronUpIcon />
                  <p className="text-xs">Show replies</p>
                </>
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
      {isDialogOpen && (
        <dialog
          className="fixed top-0 bottom-0 w-full h-screen z-50 bg-[rgba(10,10,10,0.8)] backdrop-blur-sm flex items-center justify-center"
          onClick={closeDialog}
        >
          <div className="flex flex-col gap-4 bg-gray-700/30 rounded-xl p-5 text-white border border-white/10 shadow-lg">
            <p>Are you sure you want to delete your comment?</p>
            <div className="flex gap-3 justify-end">
              <button
                className="bg-purple-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-purple-600"
                onClick={closeDialog}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteComment();
                  closeDialog();
                }}
                className="bg-red-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-red-600"
              >
                Yes, delete permanently
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};
