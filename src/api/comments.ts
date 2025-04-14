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
}: CreateNewCommentType) => {
  const { error } = await supabaseClient.from("comments").insert({
    post_id,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id,
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
}: ReplyCommentType) => {
  const { error } = await supabaseClient.from("comments").insert({
    post_id,
    content,
    parent_comment_id,
    user_id,
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
    .select("*, author:users(id, display_name, avatar_url)")
    .eq("post_id", post_id)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data as CommentFromDbType[];
};

export const deleteComments = async (
  id: CommentFromDbType["id"],
) => {
  const { data: commentToDelete } = await supabaseClient
    .from("comments")
    .select("id, parent_comment_id")
    .eq("id", id)
    .single();

  if (!commentToDelete) return;

  if (commentToDelete.parent_comment_id === null) {
    await supabaseClient
      .from("comments")
      .delete()
      .or(
        `id.eq.${commentToDelete.id},parent_comment_id.eq.${commentToDelete.id}`,
      );
  } else {
    await supabaseClient
      .from("comments")
      .delete()
      .eq("id", commentToDelete.id);
  }
};
