export type VoteFromDbType = {
  id: number;
  created_at: string;
  post_id: number;
  user_id: string;
  vote: number;
};

export type VoteType = Omit<VoteFromDbType, "id" | "created_at">;
