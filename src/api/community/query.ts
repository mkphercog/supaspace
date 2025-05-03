import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { supabaseClient } from "src/supabase-client";
import { DbCommunity, PostListItemFromDbType } from "src/types";

import { mapDbCommunityToCommunity } from "./helpers";

export const useFetchCommunityPosts = (
  id: DbCommunity["id"],
) => {
  return useQuery<PostListItemFromDbType[], Error>({
    queryKey: [QUERY_KEYS.communityPost, id],
    queryFn: async () => {
      const { data, error } = await supabaseClient.rpc(
        "get_community_posts_with_counts",
        { comm_id: id },
      );

      if (error) {
        throw new Error(error.message);
      }

      return data as PostListItemFromDbType[];
    },
  });
};

export const useFetchCommunities = () => {
  const { data, isLoading } = useQuery<DbCommunity[], Error>({
    queryKey: [QUERY_KEYS.communities],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("communities")
        .select(`
          *, 
          author:users(id, nickname, avatar_url),
          post_count:posts(count)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(error.message);
      }

      return data;
    },
  });

  return {
    communityList: mapDbCommunityToCommunity(data || []),
    isCommunityListLoading: isLoading,
  };
};
