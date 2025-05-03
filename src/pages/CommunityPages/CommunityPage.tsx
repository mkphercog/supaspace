import { useParams } from "react-router";

import { CommunityDisplay } from "./components";

export const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();

  return <CommunityDisplay id={Number(id)} />;
};
