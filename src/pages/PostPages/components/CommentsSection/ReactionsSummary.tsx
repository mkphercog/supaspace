import { FC } from "react";

import { CommentTreeType, Post, Reaction } from "src/types";

import { ReactionsSummaryItem } from "./ReactionsSummaryItem";
import { REACTION_ICONS_MAP } from "../../constants";

type Props = {
  postId: Post["id"];
  comment: CommentTreeType;
};

export const ReactionsSummary: FC<Props> = ({ postId, comment }) => {
  if (!comment.reactions.length) return null;

  const reactionCounts = comment.reactions.reduce<Record<Reaction, number>>(
    (acc, { reaction }) => {
      acc[reaction] = (acc[reaction] || 0) + 1;
      return acc;
    },
    {
      LIKE: 0,
      DISLIKE: 0,
      HEART: 0,
      FUNNY: 0,
      WOW: 0,
      STRONG: 0,
    }
  );

  const REACTIONS_STATS = Object.keys(REACTION_ICONS_MAP).map((key) => {
    const reaction = key as Reaction;
    return {
      reaction,
      count: reactionCounts[reaction],
      icon: REACTION_ICONS_MAP[reaction],
      isVisible: reactionCounts[reaction] > 0,
    };
  });

  return (
    <ul className={`flex bg-purple-400/20 px-2 py-1 rounded-md`}>
      {REACTIONS_STATS.map(({ icon, count, isVisible, reaction }, index) => {
        if (!isVisible) return null;

        return (
          <ReactionsSummaryItem
            key={index}
            postId={postId}
            commentId={comment.id}
            reaction={reaction}
            count={count}
            icon={icon}
          />
        );
      })}
    </ul>
  );
};
