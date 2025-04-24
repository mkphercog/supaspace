import { UserSettings } from "../components/UserSettings/UserSettings";
import { Typography } from "../components/ui";

const UserSettingsPage = () => {
  return (
    <div>
      <Typography.Header>Settings</Typography.Header>
      <UserSettings />
    </div>
  );
};

export default UserSettingsPage;
