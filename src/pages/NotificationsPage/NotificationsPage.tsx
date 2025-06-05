import { Typography } from "src/shared/UI";

import { Notifications } from "./components/Notifications";

export const NotificationsPage = () => {
  return (
    <div>
      <Typography.Header>Notifications</Typography.Header>
      <Notifications />
    </div>
  );
};
