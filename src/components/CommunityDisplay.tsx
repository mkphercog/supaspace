import { useQuery } from "@tanstack/react-query";
import { PostItem } from "./PostItem";
import { CommunityFromDbType } from "../types/community.type";
import { fetchCommunityPosts } from "../api/community";
import { QUERY_KEYS } from "../api/queryKeys";
import { PostFromDbType } from "../types/post.type";
import { Loader } from "./Loader";

type Props = {
  community_id: CommunityFromDbType["id"];
};

export const CommunityDisplay = ({ community_id }: Props) => {
  const { data, error, isLoading } = useQuery<PostFromDbType[], Error>({
    queryKey: [QUERY_KEYS.communityPost, community_id],
    queryFn: () => fetchCommunityPosts(community_id),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );

  return (
    <div>
      <h2 className="text-4xl md:text-6xl leading-14 md:leading-20 font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Community
      </h2>
      <h3 className="text-3xl md:text-4xl leading-15 font-bold mb-6 text-center text-blue-500">
        #{data?.[0].community_name}
      </h3>

      {data?.[0].id ? (
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
