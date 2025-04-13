import { supabaseClient } from "../supabase-client";
import {
  CommentFromDbType,
  CreateNewCommentType,
  ReplyCommentType,
} from "../types/comment.type";

export const createNewComment = async ({
  newComment,
  post_id,
  user_id,
  author,
  avatar_url,
}: CreateNewCommentType) => {
  const { error } = await supabaseClient.from("comments").insert({
    post_id,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id,
    author,
    avatar_url,
  });

  if (error) {
    supabaseClient.auth.signOut();
    throw new Error(error.message);
  }
};

export const createReplyComment = async ({
  content,
  post_id,
  parent_comment_id,
  user_id,
  author,
  avatar_url,
}: ReplyCommentType) => {
  const { error } = await supabaseClient.from("comments").insert({
    post_id,
    content,
    parent_comment_id,
    user_id,
    author,
    avatar_url,
  });

  if (error) {
    supabaseClient.auth.signOut();
    throw new Error(error.message);
  }
};

type FetchCommentsType = (
  post_id: CommentFromDbType["post_id"],
) => Promise<CommentFromDbType[]>;

export const fetchComments: FetchCommentsType = async (post_id) => {
  const { data, error } = await supabaseClient
    .from("comments")
    .select("*")
    .eq("post_id", post_id)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data as CommentFromDbType[];
};
