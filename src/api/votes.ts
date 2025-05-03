import { useMutation, useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "src/api";
import { supabaseClient } from "src/supabase-client";
import { VoteFromDbType, VoteType } from "src/types";

type UseCreateVoteProps = {
  user_id?: string | null;
  post_id: number;
  onSuccess: () => void;
};

export const useCreateVote = (
  { user_id, post_id, onSuccess }: UseCreateVoteProps,
) => {
  return useMutation({
    mutationFn: async (voteValue: number) => {
      if (!user_id) throw new Error("Not logged in user");

      const { data: existingVote } = await supabaseClient
        .from("votes")
        .select("*")
        .eq("post_id", post_id)
        .eq("user_id", user_id)
        .maybeSingle<VoteFromDbType>();

      if (!existingVote) {
        const { error } = await supabaseClient
          .from("votes")
          .insert({ post_id, user_id, vote: voteValue });

        if (error) {
          supabaseClient.auth.signOut();
          throw new Error(error.message);
        }
        return;
      }

      if (existingVote.vote !== voteValue) {
        const { error } = await supabaseClient
          .from("votes")
          .update({ vote: voteValue })
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
    onSuccess,
  });
};

export const useFetchVotes = (post_id: VoteType["post_id"]) => {
  return useQuery<VoteFromDbType[], Error>({
    queryKey: [QUERY_KEYS.votes, post_id],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("votes")
        .select("*")
        .eq("post_id", post_id);

      if (error) throw new Error(error.message);

      return data as VoteFromDbType[];
    },
  });
};
