import { Post } from "./post.type";
import { Author, DbAuthor, UserData } from "./users.type";

type CommentCommon = {
  id: number;
  content: string;
};

export type DbComment = CommentCommon & {
  created_at: string;
  parent_comment_id: number | null;
  post_id: Post["id"];
  user_id: UserData["id"];
  author: DbAuthor;
};

export type Comment = CommentCommon & {
  createdAt: string;
  parentCommentId: number | null;
  postId: Post["id"];
  userId: UserData["id"];
  author: Author;
};

export type CommentTreeType = Comment & {
  children: CommentTreeType[];
  replyStyle: number;
};

export type CreateCommentInput = Pick<
  Comment,
  "content" | "parentCommentId" | "postId" | "userId"
>;

export type CreateDbCommentInput = Pick<
  DbComment,
  "content" | "parent_comment_id" | "post_id" | "user_id"
>;
