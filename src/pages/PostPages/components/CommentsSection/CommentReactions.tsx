import cn from "classnames";
import { FC, useState } from "react";

import { REACTION_ICONS_MAP } from "src/constants";
import { useAuth } from "src/context";
import { useClickOutside } from "src/hooks";
import { Button, Typography } from "src/shared/UI";
import { Comment, Reaction, UserData } from "src/types";

type Props = {
  reactions: Comment["reactions"];
  handleCreateReaction: (
    userId: UserData["id"],
    reaction: Reaction
  ) => Promise<void>;
  isCreateCommentReactionLoading: boolean;
};

export const CommentReactions: FC<Props> = ({
  reactions,
  handleCreateReaction,
  isCreateCommentReactionLoading,
}) => {
  const { userData } = useAuth();
  const [showReactions, setShowReactions] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setShowReactions(false));

  const userReaction = reactions.find(({ userId }) => userId === userData?.id);

  return (
    <div ref={ref} className="col-start-3 inline-flex items-center">
      <div
        className={cn(
          "absolute right-0 left-0",
          "transition-all duration-300",
          "flex justify-end",
          {
            "opacity-100 bottom-[38px]": showReactions,
            "opacity-0 bottom-[0px] pointer-events-none": !showReactions,
          }
        )}
      >
        <ul
          className={cn(
            "flex gap-1 md:gap-2 justify-end flex-wrap px-3 py-2",
            "bg-[rgba(12,13,15,0.6)] backdrop-blur-sm rounded-md"
          )}
        >
          {Object.entries(REACTION_ICONS_MAP).map(([reactionName, icon]) => {
            return (
              <li key={reactionName} className="list-none!">
                <Button
                  ariaLabel={`Reaction-${reactionName}`}
                  variant="ghost"
                  onClick={async () => {
                    await handleCreateReaction(
                      userData?.id || "",
                      reactionName as Reaction
                    );
                    setShowReactions(false);
                  }}
                  className={cn("p-1! rounded-full!", {
                    "bg-purple-700/30!":
                      userReaction?.reaction === reactionName,
                  })}
                  disabled={isCreateCommentReactionLoading}
                >
                  {icon}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>

      {userData && (
        <Button
          onClick={() => setShowReactions((prev) => !prev)}
          variant="outline"
          className="col-span-2 justify-self-end"
        >
          <Typography.Text
            size="sm"
            className="flex items-center gap-2 text-inherit"
          >
            React
          </Typography.Text>
        </Button>
      )}
    </div>
  );
};
