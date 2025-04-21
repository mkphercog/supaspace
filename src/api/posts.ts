import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../supabase-client";
import {
  NewPostType,
  PostDetailsFromDbType,
  PostFromDbType,
  PostListItemFromDbType,
} from "../types/post.type";
import { QUERY_KEYS } from "./queryKeys";
import { useNavigate } from "react-router";
import { DbUserDataType } from "../types/users";

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
      navigate("/");
    },
  });
};

export const useFetchPostById = (post_id: PostFromDbType["id"]) => {
  return useQuery<PostDetailsFromDbType, Error>({
    queryKey: [QUERY_KEYS.post, post_id],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("posts")
        .select(
          "*, community:communities(id, name), author:users(id, nickname, avatar_url)",
        )
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
