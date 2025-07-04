import { FC } from "react";

import { PostPlaceholderImage } from "src/assets/images";
import { ROUTES } from "src/routes";
import { Card, Typography } from "src/shared/UI";
import { Post } from "src/types";

import { PostStats } from "./PostStats";
import { ImageSkeleton } from "../ImageSkeleton";

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
      <Card shadowVariant="withHover">
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
              {`by ${author.displayName}`}
              <span className="text-sky-500">{` (${author.role})`}</span>
            </Typography.Text>
          </div>

          <div className="flex-1">
            <ImageSkeleton
              src={imageUrl || PostPlaceholderImage}
              alt={title}
              className="h-[140px] md:h-[190px]"
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
