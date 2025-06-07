import {
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { SB_TABLE } from "src/constants";
import { useAuth } from "src/context";
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
          author:users(id, nickname, full_name_from_auth_provider),
          postDetails:posts(id, title, user_id)
        `);

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(error.message);
      }

      if (userId === currentSession?.user.id) return;

      const newCommentData = data[0];
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
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id }: Pick<Comment, "id">) => {
      const { error } = await supabaseClient
        .from(SB_TABLE.comments)
        .delete()
        .eq("id", id);

      if (error) throw new Error();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.comments, postId],
      });
    },
  });

  return {
    deleteComment: mutateAsync,
    isDeleteCommentLoading: isPending,
  };
};
