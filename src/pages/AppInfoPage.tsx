import { Typography } from "src/components/ui";

import { AppInfo } from "../components/AppInfo";

export const AppInfoPage = () => {
  return (
    <div>
      <Typography.Header>Information</Typography.Header>
      <AppInfo />
    </div>
  );
};
