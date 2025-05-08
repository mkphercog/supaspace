import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { ONE_DAY_IN_SEC, SB_STORAGE, SB_TABLE } from "src/constants";
import { ROUTES } from "src/routes";
import { supabaseClient } from "src/supabase-client";
import { CreateDbPost, CreatePost, Post } from "src/types";
import { sanitizeFilename } from "src/utils";

export const useCreatePostMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

      const { error } = await supabaseClient
        .from(SB_TABLE.posts)
        .insert<CreateDbPost>({
          title,
          content,
          image_url: publicUrl,
          user_id: userId,
          community_id: communityId,
        });

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(error.message);
      }
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
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.posts],
      });
      navigate(ROUTES.root());
    },
  });

  return {
    deletePost: mutateAsync,
    isDeletePostLoading: isPending,
  };
};
