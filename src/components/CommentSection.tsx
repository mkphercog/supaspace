import { FC, FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext.hook";
import { useQueryClient } from "@tanstack/react-query";
import { CommentItem } from "./CommentItem";
import { CommentFromDbType, CommentTreeType } from "../types/comment.type";
import { useCreateNewComment, useFetchComments } from "../api/comments";
import { QUERY_KEYS } from "../api/queryKeys";
import { Loader } from "./Loader";
import { Button } from "./ui/Button";

type Props = Pick<CommentFromDbType, "post_id">;

export const CommentSection: FC<Props> = ({ post_id }) => {
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

  const buildCommentTree = (
    flatComments: CommentFromDbType[]
  ): CommentTreeType[] => {
    const map = new Map<number, CommentTreeType>();
    const roots: CommentTreeType[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children?.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });

    return roots;
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>
      {dbUserData ? (
        <form className="mb-4 flex flex-col gap-3" onSubmit={handleSubmit}>
          <textarea
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
          <Button
            type="submit"
            className="self-end"
            disabled={!newCommentText || isPending}
          >
            {isPending ? "Posting..." : "Post comment"}
          </Button>

          {isError && (
            <p className="text-red-500 mt-2">Error posting comment.</p>
          )}
        </form>
      ) : (
        <p className="mb-4 text-purple-400">
          You must be logged in to post a comment.
        </p>
      )}

      <div className="space-y-10">
        {commentTree?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} post_id={post_id} />
        ))}
      </div>
    </div>
  );
};
