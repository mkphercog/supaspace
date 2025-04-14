import { FC } from "react";
import { Link } from "react-router";
import { PostListItemFromDbType } from "../types/post.type";
import { UserAvatar } from "./UserAvatar";

type PostItemProps = {
  post: PostListItemFromDbType;
};

export const PostItem: FC<PostItemProps> = ({
  post: { id, title, image_url, comment_count, like_count, created_at, author },
}) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
      <Link to={`/post/${id}`} className="block relative z-10">
        <div className="w-80 h-80 gap-2 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">
          <p className="text-xs text-gray-400 text-right">
            {new Date(created_at).toLocaleString()}
          </p>
          <div className="flex items-center space-x-2">
            <UserAvatar size="md" avatarUrl={author.avatar_url} />

            <div className="flex flex-col gap-2 flex-1">
              <div className="text-[20px] leading-[22px] font-semibold">
                {title}
              </div>
              <p className="text-xs text-gray-500">
                {`by ${author.display_name}`}
              </p>
            </div>
          </div>

          <div className="mt-2 flex-1">
            <img
              src={image_url}
              alt={title}
              className="w-full h-full rounded-[20px] object-cover max-h-[150px] mx-auto"
            />
          </div>
          <div className="flex justify-around items-center">
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              📊 <span className="ml-2">{like_count ?? 0}</span>
            </span>
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              💬 <span className="ml-2">{comment_count ?? 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
