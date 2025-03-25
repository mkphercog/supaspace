import { useQuery } from "@tanstack/react-query";
import { PostItem } from "./PostItem";
import {
  CommunityFromDbType,
  PostWithCommunityType,
} from "../types/community.type";
import { fetchCommunityPosts } from "../api/community";
import { QUERY_KEYS } from "../api/queryKeys";

type Props = {
  community_id: CommunityFromDbType["id"];
};

export const CommunityDisplay = ({ community_id }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCommunityType[], Error>({
    queryKey: [QUERY_KEYS.communityPost, community_id],
    queryFn: () => fetchCommunityPosts(community_id),
  });

  if (isLoading)
    return <div className="text-center py-4">Loading communities...</div>;

  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );

  return (
    <div>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data && data[0]?.communities.name} Community Posts
      </h2>

      {data && data.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No posts in this community yet.
        </p>
      )}
    </div>
  );
};
