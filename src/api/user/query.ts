import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { supabaseClient } from "src/supabase-client";
import { DbUserData, DbUserProfile, UserData } from "src/types";

import {
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
        .from("users")
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
    retry: false,
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
        .from("users")
        .select(
          "id, avatar_url, nickname, created_at, postCount:posts(count)",
        ).order("nickname", { ascending: true });

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error();
      }

      return data;
    },
    queryKey: [QUERY_KEYS.usersList],
  });

  return {
    mappedProfilesList: mapDbProfilesListToProfilesList(data || []),
    isProfilesListFetching: isFetching,
  };
};
