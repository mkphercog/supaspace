import {
  CreateDbNotificationInput,
  CreateNotificationInput,
  DbNotification,
  Notification,
} from "src/types";

type Mapper = (notifications: DbNotification[]) => Notification[];

export const mapDbNotificationsToNotifications: Mapper = (notifications) => {
  const mappedList = notifications.map(
    ({
      id,
      created_at,
      receiver_id,
      author_id,
      author,
      content,
      type,
      post_id,
      is_read,
    }): Notification => ({
      id,
      createdAt: created_at,
      receiverId: receiver_id,
      authorId: author_id,
      author: {
        id: author.id,
        displayName: author.nickname || author.full_name_from_auth_provider,
      },
      content,
      type,
      isRead: is_read,
      postId: post_id,
    }),
  );

  return mappedList;
};

type CreateMapper = (
  notifications: CreateNotificationInput[],
) => CreateDbNotificationInput[];

export const mapCreateNotificationsToDbCreateNotifications: CreateMapper = (
  notifications,
) => {
  const mappedList = notifications.map(
    ({
      receiverId,
      authorId,
      content,
      type,
      postId,
      isRead,
    }): CreateDbNotificationInput => ({
      type,
      content,
      author_id: authorId,
      receiver_id: receiverId,
      post_id: postId,
      is_read: isRead,
    }),
  );

  return mappedList;
};
