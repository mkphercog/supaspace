import { UserSettings } from "../components/UserSettings";
import { Typography } from "../components/ui";

export const UserSettingsPage = () => {
  return (
    <div>
      <Typography.Header>Settings</Typography.Header>
      <UserSettings />
    </div>
  );
};
