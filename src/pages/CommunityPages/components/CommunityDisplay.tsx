import { useFetchCommunityPosts } from "src/api/community";
import { PostItem } from "src/shared/components";
import { Loader, Typography } from "src/shared/UI";
import { Community } from "src/types";

import { NotFoundPage } from "../../NotFoundPage";

type Props = {
  id: Community["id"];
};

export const CommunityDisplay = ({ id }: Props) => {
  const { communityPosts, communityPostsError, isCommunityPostsLoading } =
    useFetchCommunityPosts(id);

  if (isCommunityPostsLoading) {
    return <Loader />;
  }

  if (communityPostsError || !communityPosts?.length) {
    return <NotFoundPage />;
  }

  return (
    <div>
      <Typography.Header color="lime">
        #{communityPosts?.[0].community.name}
      </Typography.Header>

      {communityPosts?.[0].id ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {communityPosts.map((post) => (
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
