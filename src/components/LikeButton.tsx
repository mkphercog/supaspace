import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { supabaseClient } from "../supabase-client";
import { useAuth } from "../context/AuthContext.hook";
import { VoteFromDbType } from "../types/vote.type";
import { PostFromDbType } from "../types/post.type";

type Props = {
  post_id: PostFromDbType["id"];
};

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data: existingVote } = await supabaseClient
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle<VoteFromDbType>();

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      const { error } = await supabaseClient
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseClient
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabaseClient
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue });

    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<VoteFromDbType[]> => {
  const { data, error } = await supabaseClient
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);

  return data as VoteFromDbType[];
};

export const LikeButton: FC<Props> = ({ post_id }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<VoteFromDbType[], Error>({
    queryKey: ["votes", post_id],
    queryFn: () => fetchVotes(post_id),
    // refetchInterval: 5000
  });

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("Not logged in user");

      return vote(voteValue, post_id, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", post_id] });
    },
  });

  if (isLoading) {
    return <div>Loading votes...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const userVote = votes?.find((vote) => vote.user_id === user?.id)?.vote;
  const likes = votes?.filter((vote) => vote.vote === 1).length || 0;
  const dislikes = votes?.filter((vote) => vote.vote === -1).length || 0;

  return (
    <div className="flex items-center space-x-4 my-4">
      <button
        onClick={() => mutate(1)}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userVote === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👍 {likes}
      </button>
      <button
        onClick={() => mutate(-1)}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userVote === -1 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👎 {dislikes}
      </button>
    </div>
  );
};
