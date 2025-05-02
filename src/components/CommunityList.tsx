import { useFetchCommunities } from "../api/community";
import { Loader } from "./Loader";
import { Typography } from "./ui";
import { CommunityListItem } from "./CommunityListItem";

export const CommunityList = () => {
  const { communityList, isCommunityListLoading } = useFetchCommunities();

  if (isCommunityListLoading) {
    return <Loader />;
  }

  if (!communityList.length) {
    return (
      <Typography.Text className="text-center">
        No communities found
      </Typography.Text>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-y-6">
      {communityList.map((community) => (
        <CommunityListItem key={community.id} {...community} />
      ))}
    </div>
  );
};
