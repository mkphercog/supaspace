import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { useAuth } from "../context/AuthContext.hook";

import { PostFromDbType } from "../types/post.type";
import { useCreateVote, useFetchVotes } from "../api/votes";
import { QUERY_KEYS } from "../api/queryKeys";
import { Loader } from "./Loader";

type Props = {
  post_id: PostFromDbType["id"];
};

export const LikeButton: FC<Props> = ({ post_id }) => {
  const { dbUserData } = useAuth();
  const queryClient = useQueryClient();

  const { data: votes, isLoading, error } = useFetchVotes(post_id);

  const { mutate, isPending } = useCreateVote({
    user_id: dbUserData?.id,
    post_id,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.votes, post_id] });
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const userVote = votes?.find((vote) => vote.user_id === dbUserData?.id)?.vote;
  const likes = votes?.filter((vote) => vote.vote === 1).length || 0;
  const dislikes = votes?.filter((vote) => vote.vote === -1).length || 0;

  return (
    <div className="flex items-center space-x-4 my-4">
      <button
        onClick={() => mutate(1)}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userVote === 1
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-400 text-black hover:bg-gray-500"
        }
        disabled:cursor-not-allowed disabled:bg-gray-600`}
        disabled={!dbUserData || isPending}
      >
        👍 {likes}
      </button>
      <button
        onClick={() => mutate(-1)}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userVote === -1
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-400 text-black hover:bg-gray-500"
        } disabled:cursor-not-allowed disabled:bg-gray-600`}
        disabled={!dbUserData || isPending}
      >
        👎 {dislikes}
      </button>
    </div>
  );
};
