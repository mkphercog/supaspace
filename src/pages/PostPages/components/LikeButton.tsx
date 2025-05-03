import { FC } from "react";
import { toast } from "react-toastify";

import { useCreateVote, useFetchVotes } from "src/api/votes";
import { LikeIcon, DislikeIcon } from "src/assets/icons";
import { useAuth } from "src/context";
import { Loader, Button, Typography } from "src/shared/UI";
import { Post, Vote } from "src/types";

type Props = {
  postId: Post["id"];
};

export const LikeButton: FC<Props> = ({ postId }) => {
  const { userData } = useAuth();

  const { voteList, areVotesLoading, votesError } = useFetchVotes(postId);
  const { createVote, isCreateVoteLoading } = useCreateVote(postId);

  if (areVotesLoading) {
    return <Loader />;
  }

  if (votesError) {
    return <div>Error: {votesError.message}</div>;
  }

  const handleVote = (vote: Vote["vote"]) => {
    if (!userData) return;

    toast.promise(
      async () => {
        await createVote({ userId: userData?.id, vote });
      },
      {
        pending: `🚀 Sending your vote!`,
        success: `Successfully voted!`,
      }
    );
  };

  const userVote = voteList?.find(
    ({ userId }) => userId === userData?.id
  )?.vote;
  const likes = voteList?.filter(({ vote }) => vote === 1).length || 0;
  const dislikes = voteList?.filter(({ vote }) => vote === -1).length || 0;

  return (
    <div className="flex items-center space-x-4 my-4">
      <Button
        onClick={() => handleVote(1)}
        variant={userVote === 1 ? "success" : "secondary"}
        disabled={!userData || isCreateVoteLoading}
        className="flex gap-2 items-center"
      >
        <LikeIcon />
        <Typography.Text>{likes}</Typography.Text>
      </Button>

      <Button
        onClick={() => handleVote(-1)}
        variant={userVote === -1 ? "destructive" : "secondary"}
        disabled={!userData || isCreateVoteLoading}
        className="flex gap-2 items-center"
      >
        <DislikeIcon />
        <Typography.Text>{dislikes}</Typography.Text>
      </Button>
    </div>
  );
};
