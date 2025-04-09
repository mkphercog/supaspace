import { supabaseClient } from "../supabase-client";
import {
  NewPostType,
  PostDetailsFromDbType,
  PostFromDbType,
} from "../types/post.type";

export const createNewPost = async (
  post: NewPostType,
  imageFile: File,
  userId: string,
) => {
  const filePath = `${userId}/${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabaseClient.storage.from("post-images").getPublicUrl(filePath);

  const { error } = await supabaseClient
    .from("posts")
    .insert({ ...post, image_url: publicUrl });

  if (error) throw new Error(error.message);
};

type FetchPostById = (
  post_id: PostFromDbType["id"],
) => Promise<PostDetailsFromDbType>;

export const fetchPostById: FetchPostById = async (post_id) => {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*, communities(name)")
    .eq("id", post_id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PostDetailsFromDbType;
};

export const fetchPosts = async (): Promise<PostFromDbType[]> => {
  const { data, error } = await supabaseClient.rpc("get_posts_with_counts");

  if (error) {
    throw new Error(error.message);
  }

  return data as PostFromDbType[];
};
