export type CommentFromDbType = {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  author: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
  created_at: string;
};

export type NewCommentType = Pick<
  CommentFromDbType,
  "content" | "parent_comment_id"
>;

export type CommentTreeType = CommentFromDbType & {
  children?: CommentFromDbType[];
};

export type ReplyCommentType =
  & Omit<
    CommentFromDbType,
    "id" | "parent_comment_id" | "created_at" | "author"
  >
  & {
    parent_comment_id: number;
  };

export type CreateNewCommentType = {
  newComment: NewCommentType;
} & Pick<CommentFromDbType, "post_id" | "user_id">;
