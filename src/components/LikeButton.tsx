import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { useAuth } from "../context/AuthContext";
import { PostFromDbType } from "../types/post.type";
import { useCreateVote, useFetchVotes } from "../api/votes";
import { QUERY_KEYS } from "../api/queryKeys";
import { Loader } from "./Loader";
import { Button } from "./ui";
import LikeIcon from "../assets/icons/likeIcon.svg";
import DislikeIcon from "../assets/icons/dislikeIcon.svg";

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
        <img src={LikeIcon} alt="LikeIcon" /> {likes}
      </Button>

      <Button
        onClick={() => mutate(-1)}
        variant={userVote === -1 ? "destructive" : "secondary"}
        disabled={!dbUserData || isPending}
        className="flex gap-2 items-center"
      >
        <img src={DislikeIcon} alt="DislikeIcon" /> {dislikes}
      </Button>
    </div>
  );
};
