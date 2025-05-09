import cn from "classnames";
import { FC, ReactNode, useState } from "react";

import { useFetchCommentReactionAuthors } from "src/api/commentReactions/query";
import { useClickOutside } from "src/hooks";
import { Typography } from "src/shared/UI";
import { Comment, Post, Reaction } from "src/types";

type Props = {
  postId: Post["id"];
  commentId: Comment["id"];
  reaction: Reaction;
  count: number;
  icon: ReactNode;
};

export const ReactionsSummaryItem: FC<Props> = ({
  reaction,
  postId,
  commentId,
  count,
  icon,
}) => {
  const [isReactionAuthorsVisible, setIsReactionAuthorsVisible] =
    useState(false);
  const {
    reactionAuthors,
    fetchReactionAuthors,

    areReactionAuthorsLoading,
  } = useFetchCommentReactionAuthors({
    postId,
    commentId,
    reaction,
    isVisible: isReactionAuthorsVisible,
  });

  const ref = useClickOutside<HTMLLIElement>(() => {
    setIsReactionAuthorsVisible(false);
  });

  return (
    <>
      <li
        ref={ref}
        className={cn(
          "flex items-center gap-1 list-none!",
          "hover:cursor-pointer transition-transform duration-300",
          {
            "hover:scale-[117%]": !isReactionAuthorsVisible,
          }
        )}
        onClick={() => {
          setIsReactionAuthorsVisible((prev) => !prev);

          if (!reactionAuthors.length) {
            fetchReactionAuthors();
          }
        }}
      >
        <Typography.Text size="xs" className="font-bold">
          {count}
        </Typography.Text>
        <span
          className={cn({
            "animate-bounce":
              isReactionAuthorsVisible &&
              reactionAuthors.some((item) => item.reaction === reaction),
          })}
        >
          {icon}
        </span>
      </li>

      <aside
        className={cn(
          "absolute left-0 flex flex-col gap-1 px-3 py-2",
          "bg-[rgba(12,13,15,0.7)] backdrop-blur-sm rounded-md",
          "transition-all duration-300",
          {
            "opacity-100 bottom-[38px]": isReactionAuthorsVisible,
            "opacity-0 bottom-[0px] pointer-events-none":
              !isReactionAuthorsVisible,
          }
        )}
      >
        {areReactionAuthorsLoading ? (
          <Typography.Text size="xs">Loading...</Typography.Text>
        ) : (
          reactionAuthors.map(({ author }) => {
            return (
              <Typography.Text key={author.id} size="xs">
                {author.displayName}
              </Typography.Text>
            );
          })
        )}
      </aside>
    </>
  );
};
