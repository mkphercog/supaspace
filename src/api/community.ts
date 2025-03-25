import { supabaseClient } from "../supabase-client";
import {
  CommunityFromDbType,
  NewCommunityType,
  PostWithCommunityType,
} from "../types/community.type";

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
) => Promise<PostWithCommunityType[]>;

export const fetchCommunityPosts: FetchCommunityPostsType = async (
  community_id
) => {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", community_id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as PostWithCommunityType[];
};
