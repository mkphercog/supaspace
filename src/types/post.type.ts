export type PostFromDbType = {
  id: number;
  created_at: string;
  title: string;
  content: string;
  image_url: string;
  avatar_url: string;
  like_count: number;
  comment_count: number;
  community_id?: number | null;
};

export type NewPostType = Pick<
  PostFromDbType,
  "title" | "content" | "avatar_url" | "community_id"
>;
