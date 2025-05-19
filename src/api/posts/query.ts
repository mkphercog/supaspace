import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "src/api";
import { SB_TABLE } from "src/constants";
import { supabaseClient } from "src/supabase-client";
import { DbPost, Post } from "src/types";

import { mapDbPostsToPosts } from "./utils";

export const useFetchPostById = (postId: Post["id"]) => {
  const { data, error, isLoading } = useQuery<DbPost, Error>({
    queryKey: [QUERY_KEYS.post, postId],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from(SB_TABLE.posts)
        .select(`
          *,
          community:communities(id, name),
          author:users(id, nickname, full_name_from_auth_provider, avatar_url, role),
          like_count:votes(count),
          comment_count:comments(count)
        `)
        .eq("id", postId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  return {
    postDetails: mapDbPostsToPosts(data ? [data] : [])[0],
    postDetailsError: error,
    isPostDetailsLoading: isLoading,
  };
};

export const useFetchPosts = () => {
  const { data, isLoading, error } = useQuery<DbPost[], Error>({
    queryKey: [QUERY_KEYS.posts],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from(SB_TABLE.posts).select(`
          *,
          community:communities(id, name),
          author:users(id, nickname, full_name_from_auth_provider, avatar_url, role),
          like_count:votes(count),
          comment_count:comments(count)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  return {
    posts: mapDbPostsToPosts(data || []),
    arePostsLoading: isLoading,
    postsError: error,
  };
};
