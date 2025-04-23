import { DbUserDataType } from "./users";

export type CommentFromDbType = {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  author: Pick<DbUserDataType, "id" | "nickname" | "avatar_url">;
  created_at: string;
};

export type CommentTreeType = CommentFromDbType & {
  children: CommentTreeType[];
  replyStyle: number;
};

export type CreateNewCommentType = Pick<
  CommentFromDbType,
  "content" | "parent_comment_id"
>;
