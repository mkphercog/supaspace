import { Comment } from "./comment.type";
import { Post } from "./post.type";
import { Author, DbAuthor, UserData } from "./users.type";

export type Reaction =
  | "LIKE"
  | "DISLIKE"
  | "HEART"
  | "FUNNY"
  | "WOW"
  | "STRONG";

type DbReactionCommon = {
  id: number;
  created_at: string;
  user_id: UserData["id"];
  reaction: Reaction;
};

type ReactionCommon = {
  id: number;
  createdAt: string;
  userId: UserData["id"];
  reaction: Reaction;
};

//COMMENT REACTIONS
export type DbCommentReaction = DbReactionCommon & {
  comment_id: Comment["id"];
};
export type CommentReaction = ReactionCommon & {
  commentId: Comment["id"];
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

//POST REACTIONS
export type DbPostReaction = DbReactionCommon & {
  post_id: Post["id"];
};
export type PostReaction = ReactionCommon & {
  postId: Post["id"];
};

export type CreateDbPostReaction = Pick<
  DbPostReaction,
  "reaction" | "post_id" | "user_id"
>;
export type CreatePostReaction = Pick<
  PostReaction,
  "reaction" | "userId"
>;
