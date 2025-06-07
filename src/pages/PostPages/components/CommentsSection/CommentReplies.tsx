import cn from "classnames";
import { FC, useState } from "react";

import { ChevronUpIcon } from "src/assets/icons";
import { Button, Typography } from "src/shared/UI";
import { CommentTreeType, Post } from "src/types";

import { CommentItem } from "./CommentItem";
import { getReplyStyleColor } from "../../utils/comments.utils";

type Props = {
  postId: Post["id"];
  comment: CommentTreeType;
  goToParam: string | null;
  forceExpanded: boolean;
};

export const CommentReplies: FC<Props> = ({
  postId,
  comment,
  goToParam,
  forceExpanded,
}) => {
  const [isExpanded, setIsExpanded] = useState(forceExpanded || false);

  if (!comment.children.length) return null;

  const toggleOpenState = () => setIsExpanded((prev) => !prev);

  const childrenCommentsGroupedByReplyStyle = Object.values(
    comment.children.reduce((acc, child) => {
      const key = child.replyStyle;
      if (!acc[key]) acc[key] = [];
      acc[key].push(child);
      return acc;
    }, {} as Record<number, CommentTreeType[]>)
  );

  const showRepliesBtnText = `${isExpanded ? "Hide" : "Show"} replies (${
    comment.children.length
  })`;

  return (
    <div className="mt-1">
      <Button
        className="flex items-center gap-1 text-purple-400"
        variant="ghost"
        onClick={toggleOpenState}
      >
        <ChevronUpIcon
          className={cn("transition duration-300", {
            "rotate-180": !isExpanded,
          })}
        />
        <Typography.Text size="xs" className="text-inherit">
          {showRepliesBtnText}
        </Typography.Text>
      </Button>

      {isExpanded && (
        <div className="w-full flex flex-col items-end">
          {childrenCommentsGroupedByReplyStyle.map((groupedChildrens, key) => {
            const firstChildReplyStyle = groupedChildrens[0].replyStyle;
            return (
              <div
                key={key}
                className={cn(
                  "w-full mt-5 first:mt-1 rounded-xl border",
                  getReplyStyleColor(firstChildReplyStyle)
                )}
              >
                {groupedChildrens.map((child) => (
                  <CommentItem
                    key={child.id}
                    goToParam={goToParam}
                    comment={child}
                    postId={postId}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
