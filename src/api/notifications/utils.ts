import { DbNotification, Notification } from "src/types";

type Mapper = (notifications: DbNotification[]) => Notification[];

export const mapDbNotificationsToNotifications: Mapper = (
  notifications,
) => {
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
