import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { SB_TABLE } from "src/constants";
import { supabaseClient } from "src/supabase-client";
import { Community, DbCommunity, DbPost } from "src/types";

import { mapDbCommunityToCommunity } from "./utils";
import { mapDbPostsToPosts } from "../posts/utils";

export const useFetchCommunityPosts = (
  id: Community["id"],
) => {
  const { data, error, isLoading } = useQuery<
    DbPost[],
    Error
  >({
    queryKey: [QUERY_KEYS.communityPost, id],
    queryFn: async () => {
      const { data, error } = await supabaseClient.rpc(
        "get_community_posts_with_counts",
        { comm_id: id },
      );

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(error.message);
      }

      return data;
    },
  });

  return {
    communityPosts: mapDbPostsToPosts(data || []),
    isCommunityPostsLoading: isLoading,
    communityPostsError: error,
  };
};

export const useFetchCommunities = () => {
  const { data, isLoading } = useQuery<DbCommunity[], Error>({
    queryKey: [QUERY_KEYS.communities],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from(SB_TABLE.communities)
        .select(`
          *, 
          author:users(id, nickname, full_name_from_auth_provider, avatar_url),
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
