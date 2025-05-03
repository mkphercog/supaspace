import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "src/api";
import { supabaseClient } from "src/supabase-client";
import { DbVote, Vote } from "src/types";

import { mapDbVotesToVotes } from "./utils";

export const useFetchVotes = (postId: Vote["postId"]) => {
  const { data, isLoading, error } = useQuery<DbVote[], Error>({
    queryKey: [QUERY_KEYS.votes, postId],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("votes")
        .select("*")
        .eq("post_id", postId);

      if (error) throw new Error(error.message);

      return data;
    },
  });

  return {
    voteList: mapDbVotesToVotes(data || []),
    areVotesLoading: isLoading,
    votesError: error,
  };
};
