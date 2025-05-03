import { useFetchCommunityPosts } from "src/api/community";
import { PostItem, Loader } from "src/components";
import { Typography } from "src/components/ui";
import { Community } from "src/types";

import { NotFoundPage } from "../../NotFoundPage";

type Props = {
  id: Community["id"];
};

export const CommunityDisplay = ({ id }: Props) => {
  const { data, error, isLoading } = useFetchCommunityPosts(id);

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
