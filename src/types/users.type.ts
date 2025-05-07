import { PostCommon } from "./post.type";

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
};

export type UserData = UserDataCommon & {
  displayName: string;
  createdAt: string;
  nicknameUpdatedAt: string | null;
  avatarUrl: string | null;
  avatarUrlUpdatedAt: string | null;
  fullNameFromAuthProvider: string;
};

export type DbAuthor = Pick<
  DbUserData,
  "id" | "nickname" | "full_name_from_auth_provider" | "avatar_url"
>;
export type Author = Pick<UserData, "id" | "displayName" | "avatarUrl">;

export type DbUserProfile =
  & Pick<
    DbUserData,
    | "id"
    | "nickname"
    | "full_name_from_auth_provider"
    | "avatar_url"
    | "created_at"
  >
  & {
    postCount: { count: number }[];
  };
export type UserProfile =
  & Pick<
    UserData,
    "id" | "displayName" | "avatarUrl" | "createdAt"
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
