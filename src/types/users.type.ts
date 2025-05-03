type UserDataCommon = {
  id: string;
  nickname: string;
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
  createdAt: string;
  nicknameUpdatedAt: string | null;
  avatarUrl: string | null;
  avatarUrlUpdatedAt: string | null;
  fullNameFromAuthProvider: string;
};

export type DbAuthor = Pick<DbUserData, "id" | "nickname" | "avatar_url">;

export type Author = Pick<UserData, "id" | "nickname" | "avatarUrl">;

export type CreateDbUserData = DbUserData;
