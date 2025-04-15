import { Link } from "react-router";
import { useFetchCommunities } from "../api/community";
import { Loader } from "./Loader";

export const CommunityList = () => {
  const { data, isLoading, error } = useFetchCommunities();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data?.length) {
    return (
      <p className="text-md text-center text-gray-300 mt-2">
        No communities found
      </p>
    );
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
          <p className="text-xs text-gray-300 mt-2">
            Created: {new Date(community.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};
