import { useParams } from "react-router";

import { ProfileDetails } from "./components/ProfileDetails";

export const ProfileDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return <ProfileDetails profileId={id} />;
};
