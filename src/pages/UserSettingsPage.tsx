import { Typography } from "src/components/ui";

import { UserSettings } from "../components/UserSettings/UserSettings";

export const UserSettingsPage = () => {
  return (
    <div>
      <Typography.Header>Settings</Typography.Header>
      <UserSettings />
    </div>
  );
};
