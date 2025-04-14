import { FC, FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext.hook";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentItem } from "./CommentItem";
import {
  NewCommentType,
  CommentFromDbType,
  CommentTreeType,
} from "../types/comment.type";
import { createNewComment, fetchComments } from "../api/comments";
import { QUERY_KEYS } from "../api/queryKeys";
import { Loader } from "./Loader";

type Props = Pick<CommentFromDbType, "post_id">;

export const CommentSection: FC<Props> = ({ post_id }) => {
  const [newCommentText, setNewCommentText] = useState("");
  const queryClient = useQueryClient();
  const { dbUserData } = useAuth();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<CommentFromDbType[], Error>({
    queryKey: [QUERY_KEYS.comments, post_id],
    queryFn: () => fetchComments(post_id),
  });
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewCommentType) => {
      if (!dbUserData) throw new Error("You must be logged in to add comment");

      return createNewComment({
        newComment,
        post_id,
        user_id: dbUserData.id,
      });
    },
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
        <form className="mb-4" onSubmit={handleSubmit}>
          <textarea
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
          />
          <button
            className="mt-2 bg-purple-500 text-white px-4 py-2 rounded cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={!newCommentText || isPending}
            type="submit"
          >
            {isPending ? "Posting..." : "Post comment"}
          </button>
          {isError && (
            <p className="text-red-500 mt-2">Error posting comment.</p>
          )}
        </form>
      ) : (
        <p className="mb-4 text-purple-400">
          You must be logged in to post a comment.
        </p>
      )}

      <div className="space-y-4">
        {commentTree?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} post_id={post_id} />
        ))}
      </div>
    </div>
  );
};
