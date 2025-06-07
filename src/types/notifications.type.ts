import { Author, DbAuthor } from "./users.type";

export type NotificationType =
  | "POST"
  | "COMMENT"
  | "COMMENT_REPLY"
  | "REACTION"
  | "REACTION_TO_COMMENT";

type NotificationCommon = {
  id: number;
  content: string;
  type: NotificationType;
};

export type DbNotification = NotificationCommon & {
  created_at: string;
  receiver_id: string;
  author_id: string;
  author: Omit<DbAuthor, "avatar_url" | "role">;
  post_id: number;
  comment_id: number | null;
  post_reaction_id: number | null;
  is_read: boolean;
};

export type Notification = NotificationCommon & {
  createdAt: string;
  receiverId: string;
  authorId: string;
  author: Omit<
    Author,
    | "avatarUrl"
    | "role"
  >;
  postId: number;
  commentId: number | null;
  postReactionId: number | null;
  isRead: boolean;
};

export type CreateDbNotificationInput = Pick<
  DbNotification,
  | "author_id"
  | "receiver_id"
  | "content"
  | "type"
  | "post_id"
  | "comment_id"
  | "post_reaction_id"
  | "is_read"
>;

export type CreateNotificationInput = Pick<
  Notification,
  | "authorId"
  | "receiverId"
  | "content"
  | "type"
  | "postId"
  | "commentId"
  | "postReactionId"
  | "isRead"
>;
