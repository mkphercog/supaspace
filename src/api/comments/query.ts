import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "src/api";
import { SB_TABLE } from "src/constants";
import { supabaseClient } from "src/supabase-client";
import { Comment, DbComment } from "src/types";

import { mapDbCommentsToComments } from "./utils";

export const useFetchComments = (postId: Comment["postId"]) => {
  const { data, error, isLoading } = useQuery<DbComment[], Error>({
    queryKey: [QUERY_KEYS.comments, postId],
    queryFn: async () => {
      if (!postId) throw new Error("There is no post ID.");

      const { data, error } = await supabaseClient
        .from(SB_TABLE.comments)
        .select(`
          *,
          author:users!comments_user_id_fkey(id, nickname, full_name_from_auth_provider, avatar_url),
          reactions:commentReactions!commentReactions_comment_id_fkey(id, reaction, user_id)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);

      return data;
    },
  });

  return {
    comments: mapDbCommentsToComments(data || []),
    areCommentsLoading: isLoading,
    commentsError: error,
  };
};
