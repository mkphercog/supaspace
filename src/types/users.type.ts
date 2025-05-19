import { PostCommon } from "./post.type";

export type DbUserRole = "ADMIN" | "STANDARD";
export type UserRole = "Chief Astronaut" | "Junior Astronaut";

type UserDataCommon = {
  id: string;
  nickname: string | null;
  email: string;
};

export type DbUserData = UserDataCommon & {
  created_at: string;
  nickname_updated_at: string | null;
  avatar_url: string | null;
  avatar_url_updated_at: string | null;
  full_name_from_auth_provider: string;
  role: DbUserRole;
};

export type UserData = UserDataCommon & {
  displayName: string;
  createdAt: string;
  nicknameUpdatedAt: string | null;
  avatarUrl: string | null;
  avatarUrlUpdatedAt: string | null;
  fullNameFromAuthProvider: string;
  role: UserRole;
};

export type DbAuthor = Pick<
  DbUserData,
  "id" | "nickname" | "full_name_from_auth_provider" | "avatar_url" | "role"
>;
export type Author = Pick<
  UserData,
  "id" | "displayName" | "avatarUrl" | "role"
>;

export type DbUserProfile =
  & Pick<
    DbUserData,
    | "id"
    | "nickname"
    | "full_name_from_auth_provider"
    | "avatar_url"
    | "created_at"
    | "role"
  >
  & {
    postCount: { count: number }[];
  };
export type UserProfile =
  & Pick<
    UserData,
    "id" | "displayName" | "avatarUrl" | "createdAt" | "role"
  >
  & {
    postCount: number;
  };

export type DbUserProfileDetails = Omit<DbUserProfile, "postCount"> & {
  userPosts: Pick<PostCommon, "id" | "title">[];
};
export type UserProfileDetails = Omit<UserProfile, "postCount"> & {
  userPosts: Pick<PostCommon, "id" | "title">[];
};

export type CreateDbUserData = DbUserData;
