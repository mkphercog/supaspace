import { MutateOptions, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { SB_TABLE } from "src/constants";
import { useAuth } from "src/context";
import { useInvalidateMultipleQueries } from "src/hooks";
import { supabaseClient } from "src/supabase-client";
import { Comment, CreateCommentInput, CreateDbCommentInput } from "src/types";

import { useCreateNotificationMutation } from "../notifications/mutations";

export const useCreateCommentMutation = (
  { onSuccess }: Pick<
    MutateOptions<void, Error, CreateCommentInput>,
    "onSuccess"
  >,
) => {
  const { currentSession } = useAuth();
  const { createNotification } = useCreateNotificationMutation();

  const { mutateAsync, error, isPending } = useMutation({
    mutationFn: async (
      { content, parentCommentId, postId, userId, parentCommentAuthorId }:
        CreateCommentInput,
    ) => {
      if (!userId) throw new Error("You must be logged in to add comment");

      const { data, error } = await supabaseClient
        .from(SB_TABLE.comments)
        .insert<CreateDbCommentInput>({
          post_id: postId,
          content,
          parent_comment_id: parentCommentId,
          user_id: userId,
        })
        .select(`
          *, 
          author:users!comments_user_id_fkey(id, nickname, full_name_from_auth_provider),
          postDetails:posts!comments_post_id_fkey(id, title, user_id)
        `);

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(error.message);
      }

      const newCommentData = data[0];

      if (
        (parentCommentId &&
          parentCommentAuthorId === currentSession?.user.id) ||
        (!parentCommentId &&
          newCommentData.postDetails.user_id === currentSession?.user.id)
      ) return;

      const authorDisplayName = newCommentData.author.nickname ||
        newCommentData.author.full_name_from_auth_provider;
      const commentContent = parentCommentId
        ? "reply to your comment in post"
        : "added comment to your post";

      await createNotification([{
        type: parentCommentId ? "COMMENT_REPLY" : "COMMENT",
        authorId: userId,
        receiverId: parentCommentId
          ? parentCommentAuthorId
          : newCommentData.postDetails.user_id,
        postId: newCommentData.post_id,
        commentId: newCommentData.id,
        postReactionId: null,
        commentReactionId: null,
        content: `### New comment! 💬
User \`${authorDisplayName}\` ${commentContent} - "${newCommentData.postDetails.title}"`,
        isRead: false,
      }]);
    },
    onSuccess,
  });

  return {
    createComment: mutateAsync,
    isCreateCommentLoading: isPending,
    createCommentError: error,
  };
};

export const useDeleteCommentsMutation = (postId: Comment["postId"]) => {
  const { invalidateMultipleQueries } = useInvalidateMultipleQueries();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id }: Pick<Comment, "id">) => {
      const { error } = await supabaseClient
        .from(SB_TABLE.comments)
        .delete()
        .eq("id", id);

      if (error) throw new Error();
    },
    onSuccess: () => {
      invalidateMultipleQueries([
        [QUERY_KEYS.comments, postId],
        [QUERY_KEYS.notifications],
      ]);
    },
  });

  return {
    deleteComment: mutateAsync,
    isDeleteCommentLoading: isPending,
  };
};
