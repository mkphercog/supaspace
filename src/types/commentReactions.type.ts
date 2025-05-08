import { Comment } from "./comment.type";
import { Author, DbAuthor, UserData } from "./users.type";

export type Reaction =
  | "LIKE"
  | "DISLIKE"
  | "HEART"
  | "FUNNY"
  | "WOW"
  | "STRONG";

type CommentReactionCommon = {
  id: number;
  reaction: Reaction;
};

export type DbCommentReaction = CommentReactionCommon & {
  created_at: string;
  comment_id: Comment["id"];
  user_id: UserData["id"];
};

export type CommentReaction = CommentReactionCommon & {
  createdAt: string;
  commentId: Comment["id"];
  userId: UserData["id"];
};

export type CreateDbCommentReaction = Pick<
  DbCommentReaction,
  "reaction" | "comment_id" | "user_id"
>;

export type CreateCommentReaction = Pick<
  CommentReaction,
  "reaction" | "userId"
>;

export type DbCommentReactionAuthor = DbCommentReaction & {
  author: Omit<DbAuthor, "avatar_url">;
};
export type CommentReactionAuthor = CommentReaction & {
  author: Omit<Author, "avatarUrl">;
};
