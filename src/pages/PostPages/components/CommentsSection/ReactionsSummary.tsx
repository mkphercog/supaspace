import { FC } from "react";

import { Typography } from "src/shared/UI";
import { CommentTreeType, Reaction } from "src/types";

import { REACTION_ICONS_MAP } from "../../constants";

type Props = {
  comment: CommentTreeType;
};

export const ReactionsSummary: FC<Props> = ({ comment }) => {
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
      icon: REACTION_ICONS_MAP[reaction],
      count: reactionCounts[reaction],
      isVisible: reactionCounts[reaction] > 0,
    };
  });

  return (
    <ul className={`flex gap-3 bg-purple-400/20 px-2 py-1 rounded-md`}>
      {REACTIONS_STATS.map(({ icon, count, isVisible }, index) => {
        if (!isVisible) return null;

        return (
          <li key={index} className="flex gap-1 items-center list-none!">
            <Typography.Text size="xs" className="font-bold">
              {count}
            </Typography.Text>
            {icon}
          </li>
        );
      })}
    </ul>
  );
};
