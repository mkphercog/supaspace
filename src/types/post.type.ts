export type PostFromDbType = {
  id: number;
  created_at: string;
  title: string;
  content: string;
  image_url: string;
  avatar_url: string;
  user_id: string;
  like_count: number;
  comment_count: number;
  community_id?: number | null;
  community_name: string;
};

export type NewPostType = Pick<
  PostFromDbType,
  "title" | "content" | "avatar_url" | "community_id" | "user_id"
>;

export type PostDetailsFromDbType =
  & Omit<
    PostFromDbType,
    "like_count" | "comment_count" | "community_name"
  >
  & {
    communities: {
      name: string;
    };
  };
