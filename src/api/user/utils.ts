import { DbUserData, DbUserProfile, UserData, UserProfile } from "src/types";

import { FetchUserDataErrorsType } from "./query";

type Mapper = (
  dbUserData: DbUserData,
) => UserData;

export const mapDbUserDataToUserData: Mapper = (
  {
    id,
    email,
    full_name_from_auth_provider,
    avatar_url,
    avatar_url_updated_at,
    nickname,
    nickname_updated_at,
    created_at,
  },
) => ({
  id,
  email,
  fullNameFromAuthProvider: full_name_from_auth_provider,
  avatarUrl: avatar_url,
  avatarUrlUpdatedAt: avatar_url_updated_at,
  nickname,
  nicknameUpdatedAt: nickname_updated_at,
  createdAt: created_at,
});

type MapperWithErrors = (
  dbUserData: DbUserData | FetchUserDataErrorsType,
) => UserData | FetchUserDataErrorsType;

export const mapDbUserDataToUserDataWithErrors: MapperWithErrors = (
  dbUserData,
) => {
  if (typeof dbUserData === "string") return dbUserData;

  return mapDbUserDataToUserData(dbUserData);
};

type ProfileMapper = (
  usersList: DbUserProfile[],
) => UserProfile[];

export const mapDbProfilesListToProfilesList: ProfileMapper = (
  usersList,
) =>
  usersList.map(({ id, avatar_url, created_at, nickname, postCount }) => ({
    id,
    avatarUrl: avatar_url,
    nickname,
    createdAt: created_at,
    postCount: postCount[0].count,
  }));
