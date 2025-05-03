import { FC } from "react";

import { PostPlaceholderImage } from "src/assets/images";
import { ROUTES } from "src/routes";
import { Card, Typography } from "src/shared/UI";
import { Post } from "src/types";

import { PostStats } from "./PostStats";

type PostItemProps = {
  post: Post;
};

export const PostItem: FC<PostItemProps> = ({
  post: {
    id,
    title,
    imageUrl,
    commentCount,
    likeCount,
    createdAt,
    author,
    community,
  },
}) => {
  return (
    <Typography.Link to={ROUTES.post.details(id)}>
      <Card withHover>
        <div className="flex flex-col gap-3 w-64 sm:w-72 md:w-80">
          <Typography.Text size="xs" className="text-right font-normal">
            {new Date(createdAt).toLocaleString()}
          </Typography.Text>

          <div className="flex flex-col gap-1 w-full">
            <Typography.Text
              color="lightPurple"
              className="w-full font-bold"
              size="lg"
              title={title}
              isTruncate
            >
              {title}
            </Typography.Text>
            <Typography.Text size="xs">
              {`by ${author.nickname}`}
            </Typography.Text>
          </div>

          <div className="flex-1">
            <img
              src={imageUrl || PostPlaceholderImage}
              alt={title}
              className="w-full h-full rounded-2xl object-cover max-h-[150px]"
            />
          </div>

          <Typography.Text size="sm">
            {`#${community.id ? community.name : "No community"}`}
          </Typography.Text>

          <PostStats likeCount={likeCount} commentCount={commentCount} />
        </div>
      </Card>
    </Typography.Link>
  );
};
