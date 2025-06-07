import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import {
  ONE_DAY_IN_SEC,
  REACTION_EMOJI_MAP,
  SB_STORAGE,
  SB_TABLE,
} from "src/constants";
import { useAuth } from "src/context";
import { useInvalidateMultipleQueries } from "src/hooks";
import { ROUTES } from "src/routes";
import { supabaseClient } from "src/supabase-client";
import {
  CreateDbPost,
  CreateDbPostReaction,
  CreatePost,
  CreatePostReaction,
  DbPost,
  DbPostReaction,
  Post,
} from "src/types";
import { sanitizeFilename } from "src/utils";

import { useCreateNotificationMutation } from "../notifications/mutations";
import { useFetchProfilesList } from "../user";

export const useCreatePostMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentSession } = useAuth();
  const { createNotification } = useCreateNotificationMutation();
  const { mappedProfilesList } = useFetchProfilesList();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (
      { postData: { title, content, userId, communityId }, imageFile }: {
        postData: CreatePost;
        imageFile: File;
      },
    ) => {
      if (!userId) throw new Error("You must be logged in to add new post");

      const filePath = `${userId}/${
        sanitizeFilename(imageFile.name)
      }-${Date.now()}.webp`;

      const { error: uploadError } = await supabaseClient.storage
        .from(SB_STORAGE.postImages)
        .upload(filePath, imageFile, {
          contentType: imageFile.type,
          upsert: true,
          cacheControl: `${ONE_DAY_IN_SEC}`,
        });

      if (uploadError) throw new Error(uploadError.message);

      const {
        data: { publicUrl },
      } = supabaseClient.storage.from(SB_STORAGE.postImages).getPublicUrl(
        filePath,
      );

      const { data, error } = await supabaseClient
        .from(SB_TABLE.posts)
        .insert<CreateDbPost>({
          title,
          content,
          image_url: publicUrl,
          user_id: userId,
          community_id: communityId,
        })
        .select(`
          *, 
          author:users!posts_user_id_fkey(id, nickname, full_name_from_auth_provider)
        `);

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(error.message);
      }

      const newPostData = data[0] as DbPost;
      const authorDisplayName = newPostData.author.nickname ||
        newPostData.author.full_name_from_auth_provider;

      await createNotification(
        mappedProfilesList.filter((profile) =>
          profile.id !== currentSession?.user.id
        ).map(({ id: receiverId }) => {
          return ({
            type: "POST",
            authorId: userId,
            receiverId,
            postId: newPostData.id,
            commentId: null,
            postReactionId: null,
            commentReactionId: null,
            content: `### New post! 📝
User \`${authorDisplayName}\` added new post - "${newPostData.title}"`,
            isRead: false,
          });
        }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
      navigate(ROUTES.root());
    },
  });

  return {
    createPost: mutateAsync,
    isCreatePostLoading: isPending,
    createPostError: error,
  };
};

type DeletePostProps = {
  postId: Post["id"];
  postImagePathToDelete: string;
};

export const useDeletePostMutation = () => {
  const { invalidateMultipleQueries } = useInvalidateMultipleQueries();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ postId, postImagePathToDelete }: DeletePostProps) => {
      const { error: postsTableError } = await supabaseClient
        .from(SB_TABLE.posts)
        .delete()
        .eq("id", postId);

      if (postsTableError) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error();
      }

      const { error: deletePostImageError } = await supabaseClient.storage
        .from(SB_STORAGE.postImages)
        .remove([postImagePathToDelete]);

      if (deletePostImageError) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error();
      }
    },
    onSuccess: () => {
      invalidateMultipleQueries([
        [QUERY_KEYS.posts],
        [QUERY_KEYS.notifications],
      ]);
      navigate(ROUTES.root());
    },
  });

  return {
    deletePost: mutateAsync,
    isDeletePostLoading: isPending,
  };
};

export const useCreatePostReaction = (
  postId: Post["id"],
) => {
  const { currentSession } = useAuth();
  const { invalidateMultipleQueries } = useInvalidateMultipleQueries();
  const { createNotification } = useCreateNotificationMutation();

  const { mutateAsync, error, isPending } = useMutation({
    mutationFn: async (
      { userId, reaction }: CreatePostReaction,
    ) => {
      if (!userId) throw new Error("You must be logged in to add reaction");

      const { data: existingReaction } = await supabaseClient
        .from(SB_TABLE.postReactions)
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .maybeSingle<DbPostReaction>();

      if (existingReaction?.reaction === reaction) {
        const { error } = await supabaseClient
          .from(SB_TABLE.postReactions)
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
          .from(SB_TABLE.postReactions)
          .update<Pick<DbPostReaction, "reaction">>({ reaction })
          .eq("id", existingReaction.id);

        if (error) {
          supabaseClient.auth.signOut();
          throw new Error(error.message);
        }
        return;
      }

      const { data, error } = await supabaseClient
        .from(SB_TABLE.postReactions)
        .insert<CreateDbPostReaction>({
          post_id: postId,
          user_id: userId,
          reaction,
        })
        .select(`
          *, 
          author:users!postReactions_user_id_fkey(id, nickname, full_name_from_auth_provider),
          postDetails:posts!postReactions_post_id_fkey(id, title, user_id)
        `);

      if (error) {
        supabaseClient.auth.signOut();
        throw new Error(error.message);
      }

      const reactionData = data[0];
      const authorDisplayName = reactionData.author.nickname ||
        reactionData.author.full_name_from_auth_provider;

      if (reactionData.postDetails.author_id === currentSession?.user.id) {
        return;
      }

      await createNotification([{
        type: "REACTION_TO_POST",
        authorId: userId || "",
        receiverId: reactionData.postDetails.user_id,
        postId: postId,
        commentId: null,
        postReactionId: reactionData.id,
        commentReactionId: null,
        content: `### New reaction to post! 🎉
User \`${authorDisplayName}\` added **reaction** ${REACTION_EMOJI_MAP[reaction]}
to your \`post\` - "${reactionData.postDetails.title}"`,
        isRead: false,
      }]);
    },
    onSuccess: () => {
      invalidateMultipleQueries([
        [QUERY_KEYS.posts],
        [QUERY_KEYS.post, postId],
        [QUERY_KEYS.notifications],
      ]);
    },
  });

  return {
    createPostReaction: mutateAsync,
    isCreatePostReactionLoading: isPending,
    createPostReactionError: error,
  };
};
