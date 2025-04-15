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

export type CommentTreeType = CommentFromDbType & {
  children?: CommentFromDbType[];
};

export type CreateNewCommentType = Pick<
  CommentFromDbType,
  "content" | "parent_comment_id"
>;
