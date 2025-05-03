import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";

import { QUERY_KEYS } from "src/api";
import { useCreateVote, useFetchVotes } from "src/api/votes";
import { LikeIcon, DislikeIcon } from "src/assets/icons";
import { Button, Typography } from "src/components/ui";
import { useAuth } from "src/context";
import { PostFromDbType } from "src/types";

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
      <Button
        onClick={() => mutate(1)}
        variant={userVote === 1 ? "success" : "secondary"}
        disabled={!dbUserData || isPending}
        className="flex gap-2 items-center"
      >
        <LikeIcon />
        <Typography.Text>{likes}</Typography.Text>
      </Button>

      <Button
        onClick={() => mutate(-1)}
        variant={userVote === -1 ? "destructive" : "secondary"}
        disabled={!dbUserData || isPending}
        className="flex gap-2 items-center"
      >
        <DislikeIcon />
        <Typography.Text>{dislikes}</Typography.Text>
      </Button>
    </div>
  );
};
