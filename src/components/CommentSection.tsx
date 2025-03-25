import { FC, FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext.hook";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../supabase-client";
import { CommentItem } from "./CommentItem";

type CommentSectionProps = {
  postId: number;
};

type NewCommentType = {
  content: string;
  parent_comment_id: number | null;
};

export type CommentType = {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  author: string;
  created_at: string;
};

export type CommentTreeType = CommentType & { children?: CommentType[] };

const createComment = async (
  newComment: NewCommentType,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) throw new Error("You must be logged in to comment");

  const { error } = await supabaseClient.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<CommentType[]> => {
  const { data, error } = await supabaseClient
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data as CommentType[];
};

export const CommentSection: FC<CommentSectionProps> = ({ postId }) => {
  const [newCommentText, setNewCommentText] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<CommentType[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    // refetchInterval: 5000
  });
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewCommentType) => {
      return createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata.name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!newCommentText) return;

    mutate({ content: newCommentText, parent_comment_id: null });
    setNewCommentText("");
  };

  const buildCommentTree = (flatComments: CommentType[]): CommentTreeType[] => {
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
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>
      {user ? (
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
            {isPending ? "Posting..." : "Post Comment"}
          </button>
          {isError && (
            <p className="text-red-500 mt-2">Error posting comment.</p>
          )}
        </form>
      ) : (
        <p className="mb-4 text-gray-600">
          You must be logged in to post a comment.
        </p>
      )}

      <div className="space-y-4">
        {commentTree?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};
