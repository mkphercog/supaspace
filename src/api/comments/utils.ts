import { Comment, DbComment } from "src/types";

type Mapper = (comments: DbComment[]) => Comment[];

export const mapDbCommentsToComments: Mapper = (
  comments,
) => {
  const mappedList = comments.map(
    ({
      id,
      content,
      parent_comment_id,
      created_at,
      user_id,
      author,
      post_id,
    }): Comment => ({
      id,
      content,
      parentCommentId: parent_comment_id,
      createdAt: created_at,
      userId: user_id,
      author: {
        id: author.id,
        displayName: author.nickname || author.full_name_from_auth_provider,
        avatarUrl: author.avatar_url,
      },
      postId: post_id,
    }),
  );

  return mappedList;
};
