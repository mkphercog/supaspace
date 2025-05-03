import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { QUERY_KEYS } from "src/api";
import { ROUTES } from "src/routes";
import { supabaseClient } from "src/supabase-client";
import {
  DbUserDataType,
  NewPostType,
  PostDetailsFromDbType,
  PostFromDbType,
  PostListItemFromDbType,
} from "src/types";

export const useCreateNewPost = (user_id?: DbUserDataType["id"]) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      { postData, imageFile }: { postData: NewPostType; imageFile: File },
    ) => {
      if (!user_id) throw new Error("You must be logged in to add new post");

      const filePath = `${user_id}/${imageFile.name}-${Date.now()}`;

      const { error: uploadError } = await supabaseClient.storage
        .from("post-images")
        .upload(filePath, imageFile);

      if (uploadError) throw new Error(uploadError.message);

      const {
        data: { publicUrl },
      } = supabaseClient.storage.from("post-images").getPublicUrl(filePath);

      const { error } = await supabaseClient
        .from("posts")
        .insert({ ...postData, image_url: publicUrl });

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
};

export const useFetchPostById = (post_id: PostFromDbType["id"]) => {
  return useQuery<PostDetailsFromDbType, Error>({
    queryKey: [QUERY_KEYS.post, post_id],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("posts")
        .select(`
          *,
          community:communities(id, name),
          author:users(id, nickname, avatar_url)
        `)
        .eq("id", post_id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as PostDetailsFromDbType;
    },
    retry: false,
  });
};

export const useFetchPosts = () => {
  return useQuery<PostListItemFromDbType[], Error>({
    queryKey: [QUERY_KEYS.posts],
    queryFn: async () => {
      const { data, error } = await supabaseClient.rpc("get_posts_with_counts");

      if (error) {
        throw new Error(error.message);
      }

      return data as PostListItemFromDbType[];
    },
  });
};
