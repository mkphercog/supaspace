import { useParams } from "react-router";
import { CommunityDisplay } from "../components/CommunityDisplay";

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <CommunityDisplay community_id={Number(id)} />
    </div>
  );
};

export default CommunityPage;
