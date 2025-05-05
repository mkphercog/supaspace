import { Typography } from "src/shared/UI";

import { ProfilesList } from "./components/ProfilesList";

export const ProfilesListPage = () => {
  return (
    <div>
      <Typography.Header>Profiles list</Typography.Header>
      <ProfilesList />
    </div>
  );
};
