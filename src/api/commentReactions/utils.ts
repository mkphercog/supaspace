import { CommentReactionAuthor, DbCommentReactionAuthor } from "src/types";

type Mapper = (comments: DbCommentReactionAuthor[]) => CommentReactionAuthor[];

export const mapDbReactionAuthorsToReactionAuthors: Mapper = (
  comments,
) => {
  const mappedList = comments.map(
    ({
      id,
      created_at,
      user_id,
      comment_id,
      reaction,
      author,
    }): CommentReactionAuthor => ({
      id,
      createdAt: created_at,
      userId: user_id,
      author: {
        id: author.id,
        displayName: author.nickname || author.full_name_from_auth_provider,
      },
      commentId: comment_id,
      reaction,
    }),
  );

  return mappedList;
};
