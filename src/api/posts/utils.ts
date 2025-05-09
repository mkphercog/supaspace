import { DbPost, Post } from "src/types";

type Mapper = (posts: DbPost[]) => Post[];

export const mapDbPostsToPosts: Mapper = (
  posts,
) => {
  const mappedList = posts.map(
    ({
      id,
      title,
      content,
      image_url,
      like_count,
      community_id,
      community,
      comment_count,
      created_at,
      user_id,
      author,
    }): Post => ({
      id,
      title,
      content,
      imageUrl: image_url,
      likeCount: like_count,
      commentCount: comment_count,
      communityId: community_id,
      community,
      createdAt: created_at,
      userId: user_id,
      author: {
        id: author.id,
        displayName: author.nickname || author.full_name_from_auth_provider,
        avatarUrl: author.avatar_url,
      },
    }),
  );

  return mappedList;
};
