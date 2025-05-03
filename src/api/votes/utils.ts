import { DbVote, Vote } from "src/types";

type Mapper = (votes: DbVote[]) => Vote[];

export const mapDbVotesToVotes: Mapper = (
  votes,
) => {
  const mappedList = votes.map(
    ({
      id,
      vote,
      created_at,
      user_id,
      post_id,
    }): Vote => ({
      id,
      vote,
      createdAt: created_at,
      userId: user_id,
      postId: post_id,
    }),
  );

  return mappedList;
};
