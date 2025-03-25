import { supabaseClient } from "../supabase-client";
import {
  CommunityFromDbType,
  NewCommunityType,
  PostWithCommunityType,
} from "../types/community.type";
import { PostFromDbType } from "../types/post.type";

export const createNewCommunity = async (community: NewCommunityType) => {
  const { error } = await supabaseClient.from("communities").insert(community);

  if (error) throw new Error(error.message);
};

export const fetchCommunities = async (): Promise<CommunityFromDbType[]> => {
  const { data, error } = await supabaseClient
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as CommunityFromDbType[];
};

type FetchCommunityPostsType = (
  community_id: CommunityFromDbType["id"]
) => Promise<PostFromDbType[]>;

export const fetchCommunityPosts: FetchCommunityPostsType = async (
  community_id
) => {
  const { data, error } = await supabaseClient.rpc(
    "get_community_posts_with_counts",
    { comm_id: community_id }
  );

  if (error) throw new Error(error.message);

  return data as PostWithCommunityType[];
};
