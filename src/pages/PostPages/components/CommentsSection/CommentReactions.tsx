import { FC, useState } from "react";

import { useAuth } from "src/context";
import { useClickOutside } from "src/hooks";
import { Button, Typography } from "src/shared/UI";
import { Comment, Reaction, UserData } from "src/types";

import { REACTION_ICONS_MAP } from "../../constants";

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
    <div ref={ref} className="col-start-3 inline-flex items-center relative">
      <div
        className={`
          absolute right-0 px-3 py-2
          bg-[rgba(12,13,15,0.95)] backdrop-blur-sm rounded-md 
          ${
            showReactions
              ? "opacity-100 bottom-[38px]"
              : "opacity-0 bottom-[0px] pointer-events-none"
          }
          transition-all duration-500
        `}
      >
        <ul className="flex gap-1">
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
                  className={`${
                    userReaction?.reaction === reactionName
                      ? "bg-purple-700/30!"
                      : ""
                  }`}
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
