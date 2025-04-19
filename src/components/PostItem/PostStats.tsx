import ChartIcon from "../../assets/icons/chartIcon.svg";
import CommentsIcon from "../../assets/icons/commentsIcon.svg";
import { FC } from "react";
import { Typography } from "../ui";

type PostStatsType = {
  likeCount: number;
  commentCount: number;
};

export const PostStats: FC<PostStatsType> = ({ likeCount, commentCount }) => {
  return (
    <div className="flex justify-around items-center">
      <div className="flex gap-2 items-center justify-center">
        <img src={ChartIcon} alt="ChartIcon" />
        <Typography.Text>{likeCount ?? 0}</Typography.Text>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <img src={CommentsIcon} alt="CommentsIcon" />
        <Typography.Text>{commentCount ?? 0}</Typography.Text>
      </div>
    </div>
  );
};
