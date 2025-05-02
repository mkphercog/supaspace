import { DbUserDataType } from "./users";

export type DbCommunity = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  user_id: DbUserDataType["id"];
  author: Pick<DbUserDataType, "id" | "nickname" | "avatar_url">;
  post_count: [{ count: number }];
};

export type CreateCommunityInput = Pick<
  DbCommunity,
  "name" | "description" | "user_id"
>;

export type Community = {
  id: number;
  createdAt: string;
  name: string;
  description: string;
  author: {
    id: string;
    nickname: string;
    avatarUrl: string;
  };
  postCount: number;
};
