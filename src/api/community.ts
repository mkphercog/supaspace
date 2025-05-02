import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabaseClient } from "../supabase-client";
import {
  Community,
  CreateCommunityInput,
  DbCommunity,
} from "../types/community.type";
import { PostListItemFromDbType } from "../types/post.type";
import { QUERY_KEYS } from "./queryKeys";
import { useNavigate } from "react-router";
import { ROUTES } from "../routes/routes";

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (community: CreateCommunityInput) => {
      const { error } = await supabaseClient.from("communities").insert(
        community,
      );

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.communities] });
      navigate(ROUTES.community.list());
    },
  });

  return {
    createCommunity: mutateAsync,
    isCreateCommunityLoading: isPending,
  };
};

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
    communityList: mapCommunity(data || []),
    isCommunityListLoading: isLoading,
  };
};

const mapCommunity = (communities: DbCommunity[]): Community[] => {
  return communities.map(
    ({
      id,
      created_at,
      name,
      description,
      author,
      post_count,
    }): Community => ({
      id,
      createdAt: created_at,
      name,
      description,
      author: {
        id: author.id,
        nickname: author.nickname,
        avatarUrl: author.avatar_url,
      },
      postCount: post_count[0].count ?? 0,
    }),
  );
};

export const useDeleteCommunityMutation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id }: Pick<Community, "id">) => {
      const { error } = await supabaseClient
        .from("communities")
        .delete()
        .eq("id", id);

      if (error) throw new Error();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.communities],
      });
    },
  });

  return {
    deleteCommunity: mutateAsync,
    isDeleteCommunityLoading: isPending,
  };
};
