import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "../supabase-client";
import { PostItem } from "./PostItem";
import {
  CommunityFromDbType,
  PostWithCommunityType,
} from "../types/community.type";

type CommunityDisplayProps = {
  community_id: CommunityFromDbType["id"];
};

export const fetchCommunityPost = async (
  community_id: CommunityFromDbType["id"]
): Promise<PostWithCommunityType[]> => {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", community_id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as PostWithCommunityType[];
};

export const CommunityDisplay = ({ community_id }: CommunityDisplayProps) => {
  const { data, error, isLoading } = useQuery<PostWithCommunityType[], Error>({
    queryKey: ["communityPost", community_id],
    queryFn: () => fetchCommunityPost(community_id),
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
