import { Typography } from "src/shared/UI";

import { Notifications } from "./components/Notifications";

export const NotificationsPage = () => {
  return (
    <div>
      <Typography.Header className="mb-2">Notifications</Typography.Header>
      <Notifications />
    </div>
  );
};
