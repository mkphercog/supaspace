import { Author, DbAuthor } from "./users.type";

export type NotificationType = "POST" | "COMMENT" | "REACTION";

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
  isRead: boolean;
};

export type CreateDbNotificationInput = Pick<
  DbNotification,
  | "author_id"
  | "receiver_id"
  | "content"
  | "type"
  | "post_id"
  | "is_read"
>;

export type CreateNotificationInput = Pick<
  Notification,
  | "authorId"
  | "receiverId"
  | "content"
  | "type"
  | "postId"
  | "isRead"
>;
