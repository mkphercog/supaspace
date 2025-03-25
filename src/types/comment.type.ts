export type CommentFromDbType = {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  author: string;
  created_at: string;
};

export type NewCommentType = Pick<
  CommentFromDbType,
  "content" | "parent_comment_id"
>;

export type CommentTreeType = CommentFromDbType & {
  children?: CommentFromDbType[];
};
