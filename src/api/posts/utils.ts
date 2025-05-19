import { USER_ROLES_MAP } from "src/constants";
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
      likeCount: typeof like_count === "number"
        ? like_count
        : like_count[0].count,
      commentCount: typeof comment_count === "number"
        ? comment_count
        : comment_count[0].count,
      communityId: community_id,
      community,
      createdAt: created_at,
      userId: user_id,
      author: {
        id: author.id,
        displayName: author.nickname || author.full_name_from_auth_provider,
        avatarUrl: author.avatar_url,
        role: USER_ROLES_MAP[author.role],
      },
    }),
  );

  return mappedList;
};
