import { useParams } from "react-router";
import { CommunityDisplay } from "../components/CommunityDisplay";

export const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="pt-0 md:pt-10">
      <CommunityDisplay community_id={Number(id)} />
    </div>
  );
};
