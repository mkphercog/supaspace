import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { SB_TABLE } from "src/constants";
import { supabaseClient } from "src/supabase-client";
import {
  DbUserData,
  DbUserProfile,
  DbUserProfileDetails,
  UserData,
} from "src/types";

import {
  mapDbProfileDetailsToProfileDetails,
  mapDbProfilesListToProfilesList,
  mapDbUserDataToUserDataWithErrors,
} from "./utils";

export type FetchUserDataErrorsType =
  | "NO_LOGGED_USER"
  | "NO_USER_IN_AUTH"
  | "USER_IN_AUTH_BUT_NO_IN_USERS_TABLE";

export const useFetchUserData = (userId: UserData["id"] | undefined) => {
  const { data, isFetching } = useQuery<
    DbUserData | FetchUserDataErrorsType
  >({
    queryFn: async () => {
      if (!userId) {
        return "NO_LOGGED_USER";
      }

      const { data: userAuth, error: authUserError } = await supabaseClient.auth
        .getUser();

      if (!userAuth.user || authUserError) {
        console.info("---- ℹ️ There is no user in auth db ----");
        return "NO_USER_IN_AUTH";
      }

      const { data, error } = await supabaseClient
        .from(SB_TABLE.users)
        .select("*")
        .eq("id", userId)
        .single();

      if (!data || error) {
        console.info(
          "---- ⚙️ No user in the DB, starting the process of adding.  ----",
        );
        return "USER_IN_AUTH_BUT_NO_IN_USERS_TABLE";
      }

      console.info(
        "---- ℹ️ The user already exists in the DB, no action needed. ----",
      );
      return data;
    },
    queryKey: [QUERY_KEYS.me, userId],
    enabled: !!userId,
  });

  return {
    mappedUserData: mapDbUserDataToUserDataWithErrors(data || "NO_LOGGED_USER"),
    isUserDataFetching: isFetching,
  };
};

export const useFetchProfilesList = () => {
  const { data, isFetching } = useQuery<DbUserProfile[]>({
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from(SB_TABLE.users)
        .select(
          "id, avatar_url, nickname, full_name_from_auth_provider, created_at, role, postCount:posts(count)",
        ).order("nickname", { ascending: true });

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error();
      }

      return data;
    },
    queryKey: [QUERY_KEYS.profilesList],
  });

  return {
    mappedProfilesList: mapDbProfilesListToProfilesList(data || []),
    isProfilesListFetching: isFetching,
  };
};

export const useFetchProfileDetails = (profileId: DbUserProfile["id"]) => {
  const { data, error, isFetching } = useQuery<DbUserProfileDetails>({
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from(SB_TABLE.users)
        .select(
          "id, avatar_url, nickname, full_name_from_auth_provider, created_at, role, userPosts:posts(id, title)",
        )
        .eq("id", profileId)
        .single();

      if (error) {
        throw new Error();
      }

      return data;
    },
    queryKey: [QUERY_KEYS.profileDetails, profileId],
    enabled: !!profileId,
  });

  return {
    profileDetails: mapDbProfileDetailsToProfileDetails(data ? [data] : [])[0],
    profileDetailsError: error,
    isProfileDetailsFetching: isFetching,
  };
};
