import { FC } from "react";

import { ChartIcon, CommentsIcon } from "src/assets/icons";
import { Typography } from "src/shared/UI";
import { Post } from "src/types";

type PostStatsType = Pick<Post, "commentCount" | "likeCount">;

export const PostStats: FC<PostStatsType> = ({ likeCount, commentCount }) => {
  return (
    <div className="flex justify-around items-center">
      <div className="flex gap-2 items-center justify-center">
        <ChartIcon className="text-emerald-700" />
        <Typography.Text>{likeCount ?? 0}</Typography.Text>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <CommentsIcon className="text-sky-700" />
        <Typography.Text>{commentCount ?? 0}</Typography.Text>
      </div>
    </div>
  );
};
