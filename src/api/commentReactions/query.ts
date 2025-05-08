import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { SB_TABLE } from "src/constants";
import { supabaseClient } from "src/supabase-client";
import { Comment, DbCommentReactionAuthor, Post, Reaction } from "src/types";

import { mapDbReactionAuthorsToReactionAuthors } from "./utils";

type Params = {
  postId: Post["id"];
  commentId: Comment["id"];
  reaction: Reaction;
  isVisible: boolean;
};

export const useFetchCommentReactionAuthors = (
  { postId, commentId, reaction, isVisible }: Params,
) => {
  const {
    data,
    error,
    isLoading,
    refetch,
    isFetching,
  } = useQuery<DbCommentReactionAuthor[], Error>({
    queryKey: [QUERY_KEYS.commentReactions, postId, commentId, reaction],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from(SB_TABLE.commentReactions)
        .select("*, author:users(id, nickname, full_name_from_auth_provider)")
        .eq("comment_id", commentId)
        .eq("reaction", reaction)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!(postId && commentId && reaction) && isVisible,
  });

  return {
    reactionAuthors: mapDbReactionAuthorsToReactionAuthors(data || []),
    areReactionAuthorsLoading: isLoading || isFetching,
    reactionAuthorsError: error,
    fetchReactionAuthors: refetch,
  };
};
