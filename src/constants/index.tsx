import { ReactNode } from "react";

import {
  BicepsIcon,
  DislikeIcon,
  HeartIcon,
  LaughingIcon,
  LikeIcon,
  ShockIcon,
} from "src/assets/icons";
import { DbUserRole, UserRole } from "src/types";
import { Reaction } from "src/types";

// FORM INPUTS LENGTH
export const NICKNAME_MAX_LENGTH = 24;
export const COMMUNITY_TITLE_MAX_LENGTH = 24;
export const COMMUNITY_DESC_MAX_LENGTH = 512;
export const AVATAR_MAX_FILE_SIZE_IN_kB = 200;
export const POST_TITLE_MAX_LENGTH = 64;
export const POST_CONTENT_MAX_LENGTH = 8_192;
export const POST_MAX_FILE_SIZE_IN_kB = 300;
export const COMMENT_MAX_LENGTH = 1024;

// GENERAL
export const ONE_MIN_IN_MS = 60_000;
export const ONE_DAY_IN_MS = 86_400_000;
export const ONE_DAY_IN_SEC = 86_400;

// SUPABASE
export const SB_TABLE = {
  commentReactions: "commentReactions",
  comments: "comments",
  communities: "communities",
  postReactions: "postReactions",
  posts: "posts",
  users: "users",
};

export const SB_STORAGE = {
  postImages: "post-images",
  avatars: "avatars",
};

// USERS
export const USER_ROLES_MAP: Record<DbUserRole, UserRole> = {
  ADMIN: "Chief Astronaut",
  STANDARD: "Junior Astronaut",
};

//REACTIONS
export const REACTION_ICONS_MAP: Record<Reaction, ReactNode> = {
  LIKE: <LikeIcon className="text-gray-200 w-4 h-4 md:w-5 md:h-5" />,
  DISLIKE: <DislikeIcon className="text-gray-200 w-4 h-4 md:w-5 md:h-5" />,
  HEART: <HeartIcon className="text-red-500 w-4 h-4 md:w-5 md:h-5" />,
  STRONG: <BicepsIcon className="text-orange-200 w-4 h-4 md:w-5 md:h-5" />,
  FUNNY: <LaughingIcon className="text-yellow-500 w-4 h-4 md:w-5 md:h-5" />,
  WOW: <ShockIcon className="text-yellow-500 w-4 h-4 md:w-5 md:h-5" />,
};
