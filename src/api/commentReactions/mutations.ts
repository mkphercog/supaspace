import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "src/api";
import { SB_TABLE } from "src/constants";
import { supabaseClient } from "src/supabase-client";
import {
  Comment,
  CreateCommentReaction,
  CreateDbCommentReaction,
  DbCommentReaction,
  Post,
} from "src/types";

export const useCreateCommentReaction = (
  postId: Post["id"],
  commentId: Comment["id"],
) => {
  const queryClient = useQueryClient();

  const { mutateAsync, error, isPending } = useMutation({
    mutationFn: async (
      { userId, reaction }: CreateCommentReaction,
    ) => {
      if (!userId) throw new Error("You must be logged in to add reaction");

      const { data: existingReaction } = await supabaseClient
        .from(SB_TABLE.commentReactions)
        .select("*")
        .eq("user_id", userId)
        .eq("comment_id", commentId)
        .maybeSingle<DbCommentReaction>();

      if (!existingReaction) {
        const { error } = await supabaseClient
          .from(SB_TABLE.commentReactions)
          .insert<CreateDbCommentReaction>({
            comment_id: commentId,
            user_id: userId,
            reaction,
          });

        if (error) {
          supabaseClient.auth.signOut();
          throw new Error(error.message);
        }
        return;
      }

      if (existingReaction.reaction !== reaction) {
        const { error } = await supabaseClient
          .from(SB_TABLE.commentReactions)
          .update<Pick<DbCommentReaction, "reaction">>({ reaction })
          .eq("id", existingReaction.id);

        if (error) {
          supabaseClient.auth.signOut();
          throw new Error(error.message);
        }
        return;
      }

      const { error } = await supabaseClient
        .from(SB_TABLE.commentReactions)
        .delete()
        .eq("id", existingReaction.id);

      if (error) {
        supabaseClient.auth.signOut();
        throw new Error(error.message);
      }
    },
    onSuccess: (_, { reaction }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.comments, postId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.commentReactions, postId, commentId, reaction],
      });
    },
  });

  return {
    createCommentReaction: mutateAsync,
    isCreateCommentReactionLoading: isPending,
    createCommentReactionError: error,
  };
};
