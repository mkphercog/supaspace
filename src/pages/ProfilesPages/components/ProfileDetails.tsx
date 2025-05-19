import { FC } from "react";
import { useLocation } from "react-router";

import { useFetchProfileDetails } from "src/api/user";
import { ArrowUpIcon } from "src/assets/icons";
import { NotFoundPage } from "src/pages/NotFoundPage";
import { ROUTES } from "src/routes";
import { UserAvatar } from "src/shared/components";
import { FullPageLoader } from "src/shared/layout";
import { Card, Typography } from "src/shared/UI";
import { DbUserProfile } from "src/types";

type Props = {
  profileId?: DbUserProfile["id"];
};

export const ProfileDetails: FC<Props> = ({ profileId }) => {
  const location = useLocation();
  const { profileDetails, profileDetailsError, isProfileDetailsFetching } =
    useFetchProfileDetails(profileId || "");

  if (isProfileDetailsFetching) return <FullPageLoader />;

  if (!profileDetails || profileDetailsError) return <NotFoundPage />;

  const { avatarUrl, createdAt, displayName, userPosts, role } = profileDetails;

  return (
    <Card className="relative max-w-4xl mx-auto">
      <div className="flex flex-col gap-10 items-center">
        <Typography.Link
          to={location.state?.from}
          className="absolute top-3 left-3 md:top-4 md:left-4"
        >
          <ArrowUpIcon className="-rotate-90 w-6 h-6 md:w-8 md:h-8" />
        </Typography.Link>

        <div className="flex flex-col gap-1 items-center">
          <Typography.Header className="mb-0!">{displayName}</Typography.Header>

          <Typography.Text size="lg" className="font-semibold" color="blue">
            {role}
          </Typography.Text>
        </div>

        <UserAvatar size="5xl" avatarUrl={avatarUrl} isPhotoView />

        <Typography.Text>
          Account created on:{" "}
          <span className="font-semibold">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </Typography.Text>

        <div className="flex flex-col items-center">
          <Typography.Header as="h4" color="gray">
            {userPosts.length
              ? `Added posts (${userPosts.length ?? 0}):`
              : "User hasn't added any posts yet"}
          </Typography.Header>

          {!!userPosts.length && (
            <ul className="flex flex-wrap gap-5 items-center justify-center">
              {userPosts.map((post) => (
                <li key={post.id} className="p-4 shrink-0 list-none!">
                  <Typography.Link
                    color="lightPurple"
                    to={ROUTES.post.details(post.id)}
                    className={`
                      p-4 transition duration-300
                      bg-purple-500/5 hover:bg-purple-800/30 rounded-2xl
                    `}
                  >
                    {post.title}
                  </Typography.Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
};
