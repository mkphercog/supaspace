import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../supabase-client";
import { CommunityFromDbType, NewCommunityType } from "../types/community.type";
import { PostListItemFromDbType } from "../types/post.type";
import { QUERY_KEYS } from "./queryKeys";
import { useNavigate } from "react-router";
import { ROUTES } from "../routes/routes";

export const useCreateNewCommunity = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (community: NewCommunityType) => {
      const { error } = await supabaseClient.from("communities").insert(
        community,
      );

      if (error) {
        supabaseClient.auth.signOut();
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.communities] });
      navigate(ROUTES.community.list());
    },
  });
};

export const useFetchCommunities = () => {
  return useQuery<CommunityFromDbType[], Error>({
    queryKey: [QUERY_KEYS.communities],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("communities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      return data as CommunityFromDbType[];
    },
  });
};

export const useFetchCommunityPosts = (
  community_id: CommunityFromDbType["id"],
) => {
  return useQuery<PostListItemFromDbType[], Error>({
    queryKey: [QUERY_KEYS.communityPost, community_id],
    queryFn: async () => {
      const { data, error } = await supabaseClient.rpc(
        "get_community_posts_with_counts",
        { comm_id: community_id },
      );

      if (error) {
        throw new Error(error.message);
      }

      return data as PostListItemFromDbType[];
    },
  });
};
