import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "../supabase-client";
import { Link } from "react-router";

export type CommunityType = {
  id: number;
  created_at: string;
  name: string;
  description: string;
};

export const fetchCommunities = async (): Promise<CommunityType[]> => {
  const { data, error } = await supabaseClient
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as CommunityType[];
};

export const CommunityList = () => {
  const { data, isLoading, error } = useQuery<CommunityType[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isLoading) {
    return <div>Loading communities...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((community) => (
        <div
          key={community.id}
          className="border border-white/10 p-4 rounded hover:-translate-y-1 transition transform"
        >
          <Link
            to={`/community/${community.id}`}
            className="text-2xl font-bold text-purple-500 hover:underline"
          >
            {community.name}
          </Link>
          <p className="text-gray-400 mt-2">{community.description}</p>
        </div>
      ))}
    </div>
  );
};
