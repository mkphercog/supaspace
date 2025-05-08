import {
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { SB_TABLE } from "src/constants";
import { supabaseClient } from "src/supabase-client";
import { Comment, CreateCommentInput, CreateDbCommentInput } from "src/types";

export const useCreateCommentMutation = (
  { onSuccess }: Pick<
    MutateOptions<void, Error, CreateCommentInput>,
    "onSuccess"
  >,
) => {
  const { mutateAsync, error, isPending } = useMutation({
    mutationFn: async (
      { content, parentCommentId, postId, userId }: CreateCommentInput,
    ) => {
      if (!userId) throw new Error("You must be logged in to add comment");

      const { error } = await supabaseClient.from(SB_TABLE.comments).insert<
        CreateDbCommentInput
      >({
        post_id: postId,
        content,
        parent_comment_id: parentCommentId,
        user_id: userId,
      });

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(error.message);
      }
    },
    onSuccess,
  });

  return {
    createComment: mutateAsync,
    isCreateCommentLoading: isPending,
    createCommentError: error,
  };
};

export const useDeleteCommentsMutation = (postId: Comment["postId"]) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id }: Pick<Comment, "id">) => {
      const { error } = await supabaseClient
        .from(SB_TABLE.comments)
        .delete()
        .eq("id", id);

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
