import { FC } from "react";
import { Typography } from "../ui";
import { ChartIcon, CommentsIcon } from "../../assets/icons";

type PostStatsType = {
  likeCount: number;
  commentCount: number;
};

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
