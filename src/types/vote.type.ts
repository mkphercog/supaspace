import { Post } from "./post.type";
import { UserData } from "./users.type";

type VoteCommon = {
  id: number;
  vote: -1 | 1;
};

export type DbVote = VoteCommon & {
  created_at: string;
  post_id: Post["id"];
  user_id: UserData["id"];
};

export type Vote = VoteCommon & {
  createdAt: string;
  postId: Post["id"];
  userId: UserData["id"];
};

export type CreateVote = Pick<Vote, "userId" | "vote">;
export type CreateDbVote = Pick<DbVote, "user_id" | "post_id" | "vote">;
