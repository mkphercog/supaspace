import { Community, DbCommunity } from "src/types";

export const mapDbCommunityToCommunity = (
  communities: DbCommunity[],
): Community[] => {
  const mappedCommunityList = communities.map(
    ({
      id,
      created_at,
      name,
      description,
      author,
      post_count,
    }): Community => ({
      id,
      createdAt: created_at,
      name,
      description,
      author: {
        id: author.id,
        nickname: author.nickname,
        avatarUrl: author.avatar_url,
      },
      postCount: post_count[0].count ?? 0,
    }),
  );

  return mappedCommunityList;
};
