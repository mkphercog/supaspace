import cn from "classnames";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { REACTION_ICONS_MAP } from "src/constants";
import { useAuth } from "src/context";
import { Button, Typography } from "src/shared/UI";
import { Post, Reaction, UserData } from "src/types";

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
  const [isGoToReaction, setIsGoToReaction] = useState(
    searchParams.get("goTo") === "reaction"
  );
  const { userData } = useAuth();

  const userReaction = reactions.find(({ userId }) => userId === userData?.id);

  useEffect(() => {
    if (!isGoToReaction) return;

    const timeout = setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete("goTo");
      window.history.replaceState({}, "", url.toString());
      setIsGoToReaction(false);
    }, 5000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="goTo-reaction">
      <Typography.Text color="lightPurple" size="sm" className="mb-2">
        React to post
      </Typography.Text>

      <ul
        className={cn(
          "flex gap-1 md:gap-2 justify-start flex-wrap ",
          "bg-[rgba(12,13,15,0.6)] backdrop-blur-sm rounded-md",
          { "animate-pulse": isGoToReaction }
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
