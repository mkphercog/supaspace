import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "src/api";
import { supabaseClient } from "src/supabase-client";
import { CreateDbVote, CreateVote, DbVote, Vote } from "src/types";

export const useCreateVote = (postId: Vote["postId"]) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async ({ userId, vote }: CreateVote) => {
      if (!userId) throw new Error("Not logged in user");

      const { data: existingVote } = await supabaseClient
        .from("votes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .maybeSingle<DbVote>();

      if (!existingVote) {
        const { error } = await supabaseClient
          .from("votes")
          .insert<CreateDbVote>({
            post_id: postId,
            user_id: userId,
            vote: vote,
          });

        if (error) {
          supabaseClient.auth.signOut();
          throw new Error(error.message);
        }
        return;
      }

      if (existingVote.vote !== vote) {
        const { error } = await supabaseClient
          .from("votes")
          .update<Pick<DbVote, "vote">>({ vote })
          .eq("id", existingVote.id);

        if (error) {
          supabaseClient.auth.signOut();
          throw new Error(error.message);
        }
        return;
      }

      const { error } = await supabaseClient
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (error) {
        supabaseClient.auth.signOut();
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.votes, postId] });
    },
  });

  return {
    createVote: mutateAsync,
    isCreateVoteLoading: isPending,
    createVoteError: error,
  };
};
