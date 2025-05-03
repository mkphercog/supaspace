import { Typography } from "src/shared/UI";

import { UserSettings } from "./components/UserSettings";

export const UserSettingsPage = () => {
  return (
    <div>
      <Typography.Header>Settings</Typography.Header>
      <UserSettings />
    </div>
  );
};
