import { FC, FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CommentFromDbType, CommentTreeType } from "../types/comment.type";
import { useAuth } from "../context/AuthContext.hook";
import { useCreateNewComment, useDeleteComments } from "../api/comments";
import { QUERY_KEYS } from "../api/queryKeys";
import { ChevronDownIcon } from "../assets/icons/ChevronDownIcon";
import { ChevronUpIcon } from "../assets/icons/ChevronUpIcon";
import { UserAvatar } from "./UserAvatar";
import { Button } from "./ui/Button";
import MDEditor from "@uiw/react-md-editor";

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
          <div className="flex flex-col gap-1 bg-gray-600/20 p-2 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-blue-400">
                {comment.author.display_name}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            <MDEditor.Markdown
              source={comment.content}
              className="pl-1 bg-transparent!"
            />
            {dbUserData?.id === comment.user_id && (
              <Button
                className="self-end text-xs text-red-500!"
                variant="ghost"
                onClick={openDialog}
              >
                Delete
              </Button>
            )}
          </div>

          {dbUserData && (
            <Button
              onClick={() => setShowReply((prev) => !prev)}
              variant="ghost"
              className="col-span-2 justify-self-start text-sm text-blue-500!"
            >
              {showReply ? "Cancel" : "Reply"}
            </Button>
          )}
        </div>

        {showReply && dbUserData && (
          <form onSubmit={handleReplySubmit} className="flex flex-col gap-3">
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

            {isError && <p className="text-red-500">Error posting reply.</p>}
          </form>
        )}

        {comment.children && comment.children.length > 0 && (
          <div>
            <Button
              className="flex gap-2 mb-2 text-xs text-purple-400!"
              variant="ghost"
              onClick={() => setIsCollapsed((prev) => !prev)}
            >
              {!isCollapsed ? (
                <>
                  <ChevronDownIcon /> <p>Hide replies</p>
                </>
              ) : (
                <>
                  <ChevronUpIcon />
                  <p>Show replies</p>
                </>
              )}
            </Button>

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
              <Button variant="ghost" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleDeleteComment();
                  closeDialog();
                }}
                variant="destructive"
              >
                Yes, delete permanently
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};
