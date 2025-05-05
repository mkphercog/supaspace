import { useFetchProfilesList } from "src/api/user";
import { ROUTES } from "src/routes";
import { UserAvatar } from "src/shared/components";
import { Card, Typography } from "src/shared/UI";

export const ProfilesList = () => {
  const { mappedProfilesList, isProfilesListFetching } = useFetchProfilesList();

  return (
    <Card className="max-w-2xl mx-auto" isLoading={isProfilesListFetching}>
      <div className="flex flex-col gap-3">
        {mappedProfilesList.map(
          ({ id, avatarUrl, nickname, createdAt, postCount }) => {
            return (
              <Typography.Link
                key={id}
                className={`p-4 transition duration-300 bg-purple-500/5 hover:bg-purple-800/30 rounded-2xl`}
                to={ROUTES.profiles.details(id)}
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar avatarUrl={avatarUrl} size="xl" />

                    <div className="flex flex-col">
                      <Typography.Text size="lg" className="font-bold">
                        {nickname}
                      </Typography.Text>

                      <Typography.Text size="sm" className="font-light">
                        since {new Date(createdAt).toLocaleDateString()}
                      </Typography.Text>
                    </div>
                  </div>

                  <Typography.Text>
                    Posts: <span className="text-lime-600">{postCount}</span>
                  </Typography.Text>
                </div>
              </Typography.Link>
            );
          }
        )}
      </div>
    </Card>
  );
};
