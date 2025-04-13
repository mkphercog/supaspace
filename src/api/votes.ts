import { supabaseClient } from "../supabase-client";
import { VoteFromDbType, VoteType } from "../types/vote.type";

export const createVote = async ({ user_id, post_id, vote }: VoteType) => {
  const { data: existingVote } = await supabaseClient
    .from("votes")
    .select("*")
    .eq("post_id", post_id)
    .eq("user_id", user_id)
    .maybeSingle<VoteFromDbType>();

  if (existingVote) {
    if (existingVote.vote === vote) {
      const { error } = await supabaseClient
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (error) {
        supabaseClient.auth.signOut();
        throw new Error(error.message);
      }
    } else {
      const { error } = await supabaseClient
        .from("votes")
        .update({ vote })
        .eq("id", existingVote.id);

      if (error) {
        supabaseClient.auth.signOut();
        throw new Error(error.message);
      }
    }
  } else {
    const { error } = await supabaseClient
      .from("votes")
      .insert({ post_id, user_id, vote });

    if (error) {
      supabaseClient.auth.signOut();
      throw new Error(error.message);
    }
  }
};

type FetchVotesType = (
  post_id: VoteType["post_id"],
) => Promise<VoteFromDbType[]>;

export const fetchVotes: FetchVotesType = async (post_id) => {
  const { data, error } = await supabaseClient
    .from("votes")
    .select("*")
    .eq("post_id", post_id);

  if (error) throw new Error(error.message);

  return data as VoteFromDbType[];
};
