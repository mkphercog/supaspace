import { useMutation, useQuery } from "@tanstack/react-query";
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
        .select("*, author:users(id, display_name, avatar_url)")
        .eq("post_id", post_id)
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);

      return data as CommentFromDbType[];
    },
  });
};

type UseDeleteCommentsProps = {
  id: CommentFromDbType["id"];
  onSuccess: () => void;
};

export const useDeleteComments = (
  { id, onSuccess }: UseDeleteCommentsProps,
) => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabaseClient
        .from("comments")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);
    },
    onSuccess,
  });
};
