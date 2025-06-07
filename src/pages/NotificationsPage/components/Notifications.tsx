import { useMarkAllNotificationsAsReadMutation } from "src/api/notifications/mutations";
import { CoffeeIcon } from "src/assets/icons";
import { useAuth } from "src/context";
import { ROUTES } from "src/routes";
import { Button, Card, Loader, Typography } from "src/shared/UI";

import { NotificationItem } from "./NotificationItem";

export const Notifications = () => {
  const { userData, notifications } = useAuth();
  const { markAllNotificationsAsRead, isMarkAllNotificationsAsReadLoading } =
    useMarkAllNotificationsAsReadMutation();

  if (notifications.loading) {
    return <Loader />;
  }

  if (!notifications.list.length) {
    return (
      <Card
        className="max-w-2xl mx-auto"
        containerClassName="items-center justify-center gap-20"
      >
        <Typography.Text
          size="lg"
          className="text-center font-semibold"
          color="lime"
        >
          Peace and quiet for now
        </Typography.Text>

        <CoffeeIcon className="w-20 h-20 text-amber-800" />

        <Typography.Link to={ROUTES.root()} size="lg">
          Go to dashboard
        </Typography.Link>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center jus gap-2 max-w-2xl mx-auto">
      {notifications.areUnread && (
        <div className="w-full flex items-center justify-between">
          <Typography.Text size="md">
            Unread: {notifications.unreadCount}
          </Typography.Text>
          <Button
            onClick={async () =>
              await markAllNotificationsAsRead(userData?.id || "")
            }
            variant="secondary"
            disabled={!notifications.areUnread}
          >
            <Typography.Text size="sm">Mark all as read</Typography.Text>
          </Button>
        </div>
      )}

      <ul className="w-full flex flex-col gap-4">
        {notifications.list.map((notification) => (
          <NotificationItem
            key={notification.id}
            {...notification}
            isMarkAllAsReadLoading={isMarkAllNotificationsAsReadLoading}
          />
        ))}
      </ul>
    </div>
  );
};
