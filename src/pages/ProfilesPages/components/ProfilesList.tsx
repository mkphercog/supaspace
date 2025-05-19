import TimeAgo from "react-timeago";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import enStrings from "react-timeago/lib/language-strings/en";

import { useFetchProfilesList } from "src/api/user";
import { ROUTES } from "src/routes";
import { UserAvatar } from "src/shared/components";
import { Card, Typography } from "src/shared/UI";

const formatter = buildFormatter(enStrings);

export const ProfilesList = () => {
  const { mappedProfilesList, isProfilesListFetching } = useFetchProfilesList();

  return (
    <Card className="max-w-2xl mx-auto" isLoading={isProfilesListFetching}>
      <div className="flex flex-col gap-3">
        {mappedProfilesList.map(
          ({ id, avatarUrl, displayName, createdAt, postCount, role }) => {
            return (
              <Typography.Link
                key={id}
                className={`
                  p-4 transition duration-300
                  bg-purple-500/5 hover:bg-purple-800/30 rounded-2xl
                `}
                to={ROUTES.profiles.details(id)}
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar avatarUrl={avatarUrl} size="xl" />

                    <div className="flex flex-col">
                      <Typography.Text size="lg" className="font-bold">
                        {displayName}
                      </Typography.Text>

                      <Typography.Text size="sm" color="blue">
                        {role}
                      </Typography.Text>
                    </div>
                  </div>

                  <Typography.Text>
                    Posts: <span className="text-lime-600">{postCount}</span>
                  </Typography.Text>
                </div>

                <Typography.Text size="sm" className="mt-2 font-light">
                  Joined{" "}
                  <TimeAgo
                    title={`Since ${new Date(createdAt).toLocaleString()}`}
                    date={createdAt}
                    formatter={formatter}
                  />
                </Typography.Text>
              </Typography.Link>
            );
          }
        )}
      </div>
    </Card>
  );
};
