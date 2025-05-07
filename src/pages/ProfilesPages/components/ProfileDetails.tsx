import { FC } from "react";

import { useFetchProfileDetails } from "src/api/user";
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
  const { profileDetails, profileDetailsError, isProfileDetailsFetching } =
    useFetchProfileDetails(profileId || "");

  if (isProfileDetailsFetching) return <FullPageLoader />;

  if (!profileDetails || profileDetailsError) return <NotFoundPage />;

  const { avatarUrl, createdAt, displayName, userPosts } = profileDetails;

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-10 items-center">
        <Typography.Header>{displayName}</Typography.Header>
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
                      p-4 transition duration-300 bg-purple-500/5 hover:bg-purple-800/30 rounded-2xl
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
