import { Community, DbCommunity } from "src/types";

type Mapper = (communities: DbCommunity[]) => Community[];

export const mapDbCommunityToCommunity: Mapper = (
  communities,
) => {
  const mappedList = communities.map(
    ({
      id,
      name,
      description,
      post_count,
      created_at,
      user_id,
      author,
    }): Community => ({
      id,
      name,
      description,
      postCount: post_count[0].count ?? 0,
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
