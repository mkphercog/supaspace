import { useFetchCommunities } from "../api/community";
import { ROUTES } from "../routes/routes";
import { Loader } from "./Loader";
import { Card, Typography } from "./ui";

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
      <Typography.Text className="text-center">
        No communities found
      </Typography.Text>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-y-6">
      {data?.map((community) => (
        <Typography.Link
          key={community.id}
          to={ROUTES.community.details(community.id)}
        >
          <Card withHover>
            <Typography.Header as="h4" color="lime" className="mb-0!">
              #{community.name}
            </Typography.Header>

            <Typography.Text>{community.description}</Typography.Text>

            <Typography.Text size="xs" className="font-normal">
              Created at: {new Date(community.created_at).toLocaleString()}
            </Typography.Text>
          </Card>
        </Typography.Link>
      ))}
    </div>
  );
};
