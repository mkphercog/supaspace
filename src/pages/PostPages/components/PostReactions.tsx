import cn from "classnames";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { REACTION_ICONS_MAP } from "src/constants";
import { useAuth } from "src/context";
import { Button, Typography } from "src/shared/UI";
import { Post, Reaction, UserData } from "src/types";
import { clearSearchParamsTimeout } from "src/utils/clearSearchParamsTimeout";

type Props = {
  reactions: Post["reactions"];
  handleCreateReaction: (
    userId: UserData["id"],
    reaction: Reaction
  ) => Promise<void>;
  isCreatePostReactionLoading: boolean;
};

export const PostReactions: FC<Props> = ({
  reactions,
  handleCreateReaction,
  isCreatePostReactionLoading,
}) => {
  const [searchParams] = useSearchParams();
  const [goToParam, setGoToParam] = useState(searchParams.get("goTo"));
  const { userData } = useAuth();

  const userReaction = reactions.find(({ userId }) => userId === userData?.id);

  useEffect(() => {
    if (goToParam !== "reaction-to-post") return;

    const timeout = clearSearchParamsTimeout(setGoToParam);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div data-go-to="reaction-to-post">
      <Typography.Text color="lightPurple" size="sm" className="mb-2">
        React to post
      </Typography.Text>

      <ul
        className={cn(
          "flex gap-1 md:gap-2 justify-start flex-wrap ",
          "bg-[rgba(12,13,15,0.6)] backdrop-blur-sm rounded-md",
          { "animate-pulse": goToParam === "reaction-to-post" }
        )}
      >
        {Object.entries(REACTION_ICONS_MAP).map(([reactionName, icon]) => {
          return (
            <li key={reactionName} className="list-none!">
              <Button
                ariaLabel={`Reaction-${reactionName}`}
                variant="outline"
                onClick={async () => {
                  await handleCreateReaction(
                    userData?.id || "",
                    reactionName as Reaction
                  );
                }}
                className={cn({
                  "bg-purple-700/30!": userReaction?.reaction === reactionName,
                })}
                disabled={!userData || isCreatePostReactionLoading}
              >
                <div className="flex gap-1 items-center">
                  {icon}
                  <Typography.Text className="font-semibold">
                    {
                      reactions.filter(
                        ({ reaction }) => reaction === reactionName
                      ).length
                    }
                  </Typography.Text>
                </div>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
