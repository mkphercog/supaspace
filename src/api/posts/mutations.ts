import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { QUERY_KEYS } from "src/api";
import { ROUTES } from "src/routes";
import { supabaseClient } from "src/supabase-client";
import { CreateDbPost, CreatePost } from "src/types";

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

      const filePath = `${userId}/${imageFile.name}-${Date.now()}`;

      const { error: uploadError } = await supabaseClient.storage
        .from("post-images")
        .upload(filePath, imageFile);

      if (uploadError) throw new Error(uploadError.message);

      const {
        data: { publicUrl },
      } = supabaseClient.storage.from("post-images").getPublicUrl(filePath);

      const { error } = await supabaseClient
        .from("posts")
        .insert<CreateDbPost>({
          title,
          content,
          image_url: publicUrl,
          user_id: userId,
          community_id: communityId,
        });

      if (error) {
        supabaseClient.auth.signOut();
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
