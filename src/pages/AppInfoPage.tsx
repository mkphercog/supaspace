import { AppInfo } from "../components/AppInfo";
import { Typography } from "../components/ui";

const AppInfoPage = () => {
  return (
    <div>
      <Typography.Header>Information</Typography.Header>
      <AppInfo />
    </div>
  );
};

export default AppInfoPage;
