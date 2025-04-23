import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../supabase-client";
import { CommentFromDbType, CreateNewCommentType } from "../types/comment.type";
import { QUERY_KEYS } from "./queryKeys";

type UseCreateNewCommentProps = {
  post_id: CommentFromDbType["post_id"];
  user_id?: CommentFromDbType["user_id"];
  onSuccess?: () => void;
};

export const useCreateNewComment = (
  { post_id, user_id, onSuccess }: UseCreateNewCommentProps,
) => {
  return useMutation({
    mutationFn: async (
      { content, parent_comment_id }: CreateNewCommentType,
    ) => {
      if (!user_id) throw new Error("You must be logged in to add comment");

      const { error } = await supabaseClient.from("comments").insert({
        post_id,
        content,
        parent_comment_id,
        user_id,
      });

      if (error) {
        supabaseClient.auth.signOut();
        throw new Error(error.message);
      }
    },
    onSuccess,
  });
};

export const useFetchComments = (post_id: CommentFromDbType["post_id"]) => {
  return useQuery<CommentFromDbType[], Error>({
    queryKey: [QUERY_KEYS.comments, post_id],
    queryFn: async () => {
      if (!post_id) throw new Error("There is no post ID.");

      const { data, error } = await supabaseClient
        .from("comments")
        .select("*, author:users(id, nickname, avatar_url)")
        .eq("post_id", post_id)
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);

      return data as CommentFromDbType[];
    },
  });
};

export const useDeleteCommentsMutation = (postId: number) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (
      commentId: CommentFromDbType["id"],
    ) => {
      const { error } = await supabaseClient
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw new Error();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.comments, postId],
      });
    },
  });

  return {
    deleteComment: mutateAsync,
    isDeleteCommentLoading: isPending,
  };
};
