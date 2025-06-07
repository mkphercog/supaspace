import { useMutation } from "@tanstack/react-query";

import { QUERY_KEYS } from "src/api";
import { REACTION_EMOJI_MAP, SB_TABLE } from "src/constants";
import { useAuth } from "src/context";
import { useInvalidateMultipleQueries } from "src/hooks";
import { supabaseClient } from "src/supabase-client";
import {
  Comment,
  CreateCommentReaction,
  CreateDbCommentReaction,
  DbCommentReaction,
  Post,
} from "src/types";

import { useCreateNotificationMutation } from "../notifications/mutations";

export const useCreateCommentReaction = (
  postId: Post["id"],
  commentId: Comment["id"],
) => {
  const { currentSession } = useAuth();
  const { invalidateMultipleQueries } = useInvalidateMultipleQueries();
  const { createNotification } = useCreateNotificationMutation();

  const { mutateAsync, error, isPending } = useMutation({
    mutationFn: async (
      { userId, reaction }: CreateCommentReaction,
    ) => {
      if (!userId) throw new Error("You must be logged in to add reaction");

      const { data: existingReaction } = await supabaseClient
        .from(SB_TABLE.commentReactions)
        .select("*")
        .eq("user_id", userId)
        .eq("comment_id", commentId)
        .maybeSingle<DbCommentReaction>();

      if (existingReaction?.reaction === reaction) {
        const { error } = await supabaseClient
          .from(SB_TABLE.commentReactions)
          .delete()
          .eq("id", existingReaction.id);

        if (error) {
          supabaseClient.auth.signOut();
          throw new Error(error.message);
        }
        return;
      }

      if (!!existingReaction && existingReaction.reaction !== reaction) {
        const { error } = await supabaseClient
          .from(SB_TABLE.commentReactions)
          .update<Pick<DbCommentReaction, "reaction">>({ reaction })
          .eq("id", existingReaction.id);

        if (error) {
          supabaseClient.auth.signOut();
          throw new Error(error.message);
        }
        return;
      }

      const { data, error } = await supabaseClient
        .from(SB_TABLE.commentReactions)
        .insert<CreateDbCommentReaction>({
          comment_id: commentId,
          user_id: userId,
          reaction,
        })
        .select(`
          *, 
          author:users(id, nickname, full_name_from_auth_provider),
          commentDetails:comments(id, content, user_id)
        `);

      if (error) {
        supabaseClient.auth.signOut();
        throw new Error(error.message);
      }

      const reactionData = data[0];
      const authorDisplayName = reactionData.author.nickname ||
        reactionData.author.full_name_from_auth_provider;

      if (reactionData.commentDetails.user_id === currentSession?.user.id) {
        return;
      }

      await createNotification([{
        type: "REACTION_TO_COMMENT",
        authorId: userId || "",
        receiverId: reactionData.commentDetails.user_id,
        postId: postId,
        commentId,
        postReactionId: null,
        commentReactionId: reactionData.id,
        content: `### New reaction to comment! 🎉
User \`${authorDisplayName}\` added **reaction** ${REACTION_EMOJI_MAP[reaction]}
to your \`comment\` - "${
          reactionData.commentDetails.content.length > 64
            ? `${reactionData.commentDetails.content.slice(0, 64)}...`
            : reactionData.commentDetails.content
        }"`,
        isRead: false,
      }]);
    },
    onSuccess: (_, { reaction }) => {
      invalidateMultipleQueries([
        [QUERY_KEYS.comments, postId],
        [QUERY_KEYS.commentReactions, postId, commentId, reaction],
        [QUERY_KEYS.notifications],
      ]);
    },
  });

  return {
    createCommentReaction: mutateAsync,
    isCreateCommentReactionLoading: isPending,
    createCommentReactionError: error,
  };
};
