import { USER_ROLES_MAP } from "src/constants";
import {
  DbUserData,
  DbUserProfile,
  DbUserProfileDetails,
  UserData,
  UserProfile,
  UserProfileDetails,
} from "src/types";

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
    role,
    email_subscribe,
  },
) => ({
  id,
  email,
  nickname,
  fullNameFromAuthProvider: full_name_from_auth_provider,
  displayName: nickname || full_name_from_auth_provider,
  avatarUrl: avatar_url,
  avatarUrlUpdatedAt: avatar_url_updated_at,
  nicknameUpdatedAt: nickname_updated_at,
  createdAt: created_at,
  role: USER_ROLES_MAP[role],
  emailSubscribe: email_subscribe,
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
) => {
  return usersList.map((
    {
      id,
      avatar_url,
      created_at,
      nickname,
      full_name_from_auth_provider,
      postCount,
      role,
    },
  ) => ({
    id,
    avatarUrl: avatar_url,
    displayName: nickname || full_name_from_auth_provider,
    createdAt: created_at,
    postCount: postCount[0].count,
    role: USER_ROLES_MAP[role],
  }));
};

type ProfileDetailsMapper = (
  usersList: DbUserProfileDetails[],
) => UserProfileDetails[];

export const mapDbProfileDetailsToProfileDetails: ProfileDetailsMapper = (
  usersList,
) =>
  usersList.map((
    {
      id,
      avatar_url,
      created_at,
      nickname,
      full_name_from_auth_provider,
      userPosts,
      role,
    },
  ) => ({
    id,
    avatarUrl: avatar_url,
    displayName: nickname || full_name_from_auth_provider,
    createdAt: created_at,
    userPosts,
    role: USER_ROLES_MAP[role],
  }));
