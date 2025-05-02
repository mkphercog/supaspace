import { FC, useState } from "react";
import { ROUTES } from "../routes/routes";
import { Button, Card, Typography } from "./ui";
import { UserAvatar } from "./UserAvatar";
import { ChevronUpIcon, InfoIcon } from "../assets/icons";
import { Community } from "../types/community.type";
import { useAuth } from "../context/AuthContext";
import { useDeleteCommunityMutation } from "../api/community";
import { useDeleteWarnToast } from "../hooks/useDeleteWarnToast";

type CommunityListItemProps = Community;

export const CommunityListItem: FC<CommunityListItemProps> = ({
  id,
  name,
  description,
  createdAt,
  author,
  postCount,
}) => {
  const { dbUserData } = useAuth();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { deleteCommunity } = useDeleteCommunityMutation();
  const { startDeletingProcess } = useDeleteWarnToast({
    subjectName: "Community",
    realDeleteFn: async () => {
      if (!dbUserData) return;

      await deleteCommunity({ id });
    },
  });

  return (
    <Card withHover>
      <Typography.Link to={ROUTES.community.details(id)}>
        <Typography.Header as="h4" color="lime" className="mb-0!">
          #{name}
        </Typography.Header>

        <Typography.Text>{description}</Typography.Text>
      </Typography.Link>

      <Button
        className="self-start flex items-center gap-1 mb-1 text-purple-400"
        variant="ghost"
        onClick={() => setIsDetailsOpen((prev) => !prev)}
      >
        <ChevronUpIcon className={!isDetailsOpen ? "rotate-180" : ""} />
        <Typography.Text size="xs" className="text-inherit">
          {!isDetailsOpen ? "Show details" : "Hide details"}
        </Typography.Text>
      </Button>

      {isDetailsOpen && (
        <>
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-3">
            <div className="flex items-center gap-3">
              <UserAvatar avatarUrl={author.avatarUrl} size="md" />

              <div className="flex flex-col">
                <Typography.Text size="xs">
                  Created by{" "}
                  <span className="font-semibold">{author.nickname}</span>
                </Typography.Text>
                <Typography.Text size="xs">
                  on{" "}
                  <span className="font-semibold">
                    {new Date(createdAt).toLocaleString()}
                  </span>
                </Typography.Text>
              </div>
            </div>

            <Typography.Text size="sm">
              Community posts:{" "}
              <span className="font-semibold text-lime-500">{postCount}</span>
            </Typography.Text>
          </div>

          {dbUserData?.id === author.id && (
            <div className="flex justify-between items-center gap-10">
              <Typography.Text
                className="flex items-start gap-1 text-justify"
                size="xs"
                color="blue"
              >
                <InfoIcon className="h-5 w-5" />
                If a community has posts and is deleted, the posts will remain
                in the app but will no longer be associated with any community
              </Typography.Text>

              <Button
                className="self-end"
                onClick={startDeletingProcess}
                variant="destructive"
              >
                <Typography.Text size="sm">Delete</Typography.Text>
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};
