import { DbPostReaction, PostReaction } from "./reactions.type";
import { Community } from "./community.type";
import { Author, DbAuthor, UserData } from "./users.type";

export type PostCommon = {
  id: number;
  title: string;
  content: string;
  community: Pick<Community, "id" | "name">;
};

export type DbPost = PostCommon & {
  created_at: string;
  image_url: string;
  user_id: UserData["id"];
  like_count: number | [{ count: number }];
  comment_count: number | [{ count: number }];
  community_id?: Community["id"] | null;
  author: DbAuthor;
  reactions: Pick<DbPostReaction, "id" | "reaction" | "user_id">[];
};

export type Post = PostCommon & {
  createdAt: string;
  imageUrl: string;
  userId: UserData["id"];
  likeCount: number;
  commentCount: number;
  communityId?: Community["id"] | null;
  author: Author;
  reactions: Pick<PostReaction, "id" | "reaction" | "userId">[];
};

export type CreatePost = Pick<
  Post,
  "title" | "content" | "communityId" | "userId"
>;

export type CreateDbPost = Pick<
  DbPost,
  "title" | "content" | "community_id" | "user_id" | "image_url"
>;

export type PostDetails = Omit<
  Post,
  "likeCount" | "commentCount"
>;
