import { FC } from "react";
import { PostListItemFromDbType } from "../../types/post.type";
import { Card, Typography } from "../ui";
import PostPlaceholderImage from "../../assets/images/postPlaceholder.jpg";
import { PostStats } from "./PostStats";

type PostItemProps = {
  post: PostListItemFromDbType;
};

export const PostItem: FC<PostItemProps> = ({
  post: {
    id,
    title,
    image_url,
    comment_count,
    like_count,
    created_at,
    author,
    community,
  },
}) => {
  return (
    <Typography.Link to={`/post/${id}`}>
      <Card withHover>
        <div className="flex flex-col gap-3 w-64 sm:w-72 md:w-80">
          <Typography.Text size="xs" className="text-right font-normal">
            {new Date(created_at).toLocaleString()}
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
              src={image_url || PostPlaceholderImage}
              alt={title}
              className="w-full h-full rounded-2xl object-cover max-h-[150px]"
            />
          </div>

          <Typography.Text size="sm">
            {`#${community.id ? community.name : "No community"}`}
          </Typography.Text>

          <PostStats likeCount={like_count} commentCount={comment_count} />
        </div>
      </Card>
    </Typography.Link>
  );
};
