import { DbUserRole, UserRole } from "src/types";

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
  posts: "posts",
  users: "users",
  votes: "votes",
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
