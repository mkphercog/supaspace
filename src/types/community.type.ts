import { PostFromDbType } from "./post.type";

export type CommunityFromDbType = {
  id: number;
  created_at: string;
  name: string;
  description: string;
};

export type NewCommunityType = Pick<
  CommunityFromDbType,
  "name" | "description"
>;

export type PostWithCommunityType = PostFromDbType & {
  communities: {
    name: string;
  };
};
