export type PostFromDbType = {
  id: number;
  created_at: string;
  title: string;
  content: string;
  image_url: string;
  user_id: string;
  like_count: number;
  comment_count: number;
  community_id?: number | null;
  community: {
    id: number;
    name: string;
  };
  author: {
    id: string;
    avatar_url: string;
    display_name: string;
  };
};

export type PostListItemFromDbType = Omit<
  PostFromDbType,
  "community_id" | "user_id"
>;

export type NewPostType = Pick<
  PostFromDbType,
  "title" | "content" | "community_id" | "user_id"
>;

export type PostDetailsFromDbType = Omit<
  PostFromDbType,
  "like_count" | "comment_count"
>;
