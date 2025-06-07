import { FC, lazy } from "react";
import { useNavigate } from "react-router";

import { useMarkNotificationAsReadMutation } from "src/api/notifications/mutations";
import { ROUTES } from "src/routes";
import { Button, Card, Typography, TypographyColors } from "src/shared/UI";
import { Notification, NotificationType } from "src/types";

import { getSearchParam } from "../utils";
const MDPreview = lazy(() => import("@uiw/react-markdown-preview"));

type Props = Omit<Notification, "receiverId" | "authorId"> & {
  isMarkAllAsReadLoading: boolean;
};

const TYPE_COLORS_MAP: Record<NotificationType, TypographyColors> = {
  POST: "lightPurple",
  COMMENT: "blue",
  COMMENT_REPLY: "blue",
  REACTION: "amber",
  REACTION_TO_COMMENT: "amber",
};

export const NotificationItem: FC<Props> = ({
  id,
  type,
  isRead,
  postId,
  commentId,
  content,
  createdAt,
  isMarkAllAsReadLoading,
}) => {
  const navigate = useNavigate();
  const { markNotificationAsRead, isMarkNotificationAsReadLoading } =
    useMarkNotificationAsReadMutation();

  const markAsRead = async () => {
    if (!isRead) {
      await markNotificationAsRead(id);
    }
  };

  const markAsReadAndRedirect = async () => {
    await markAsRead();

    navigate({
      pathname: ROUTES.post.details(postId),
      search: getSearchParam(type, commentId),
    });
  };

  const isLoading = isMarkNotificationAsReadLoading || isMarkAllAsReadLoading;

  return (
    <Card isLoading={isLoading}>
      <div className="flex gap-3 items-center">
        <Typography.Text size="xxs" className="mr-auto text-gray-500">
          {new Date(createdAt).toLocaleString()}
        </Typography.Text>

        <Typography.Text
          className="font-semibold"
          color={TYPE_COLORS_MAP[type]}
          size="xxs"
        >
          {type.replace(/_/g, " ")}
        </Typography.Text>

        {!isRead && (
          <Typography.Text className="font-semibold" color="lime" size="xxs">
            NEW!
          </Typography.Text>
        )}
      </div>

      <MDPreview source={content} className="bg-transparent! text-slate-500" />

      <div className="flex gap-2 justify-end">
        {!isRead && (
          <Button onClick={markAsRead} variant="secondary">
            <Typography.Text size="xs">Mark as read</Typography.Text>
          </Button>
        )}

        <Button onClick={markAsReadAndRedirect} variant="primary">
          <Typography.Text size="xs">Show</Typography.Text>
        </Button>
      </div>
    </Card>
  );
};
