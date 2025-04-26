import { PostItem } from "./PostItem";
import { CommunityFromDbType } from "../types/community.type";
import { useFetchCommunityPosts } from "../api/community";
import { Loader } from "./Loader";
import { Typography } from "./ui";
import { NotFoundPage } from "../pages/NotFoundPage";

type Props = {
  community_id: CommunityFromDbType["id"];
};

export const CommunityDisplay = ({ community_id }: Props) => {
  const { data, error, isLoading } = useFetchCommunityPosts(community_id);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data?.length) return <NotFoundPage />;

  return (
    <div>
      <Typography.Header color="lime">
        #{data?.[0].community.name}
      </Typography.Header>

      {data?.[0].id ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Typography.Text className="text-center">
          No posts in this community yet.
        </Typography.Text>
      )}
    </div>
  );
};
