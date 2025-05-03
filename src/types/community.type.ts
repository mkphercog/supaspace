import { Author, DbAuthor, UserData } from "./users.type";

type CommunityCommon = {
  id: number;
  name: string;
  description: string;
};

export type DbCommunity = CommunityCommon & {
  created_at: string;
  post_count: [{ count: number }];
  user_id: UserData["id"];
  author: DbAuthor;
};

export type Community = CommunityCommon & {
  createdAt: string;
  postCount: number;
  userId: UserData["id"];
  author: Author;
};

export type CreateCommunityInput = Pick<
  Community,
  "name" | "description" | "userId"
>;

export type CreateDbCommunityInput = Pick<
  DbCommunity,
  "name" | "description" | "user_id"
>;
