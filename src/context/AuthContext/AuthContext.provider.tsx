import { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { QUERY_KEYS } from "src/api";
import { useFetchNotifications } from "src/api/notifications";
import {
  insertUserDataToDb,
  useDeleteUserWithDataMutation,
  useFetchUserData,
} from "src/api/user";
import { ROUTES } from "src/routes";
import { supabaseClient } from "src/supabase-client";
import { UserData } from "src/types";

import { AuthContext, AuthContextType } from "./AuthContext";

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userData, setUserData] = useState<AuthContextType["userData"]>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mappedUserData, isUserDataFetching } = useFetchUserData(
    currentSession?.user.id
  );
  const { notifications, areNotificationsLoading } = useFetchNotifications(
    currentSession?.user.id || undefined
  );
  const { deleteUserWithData, isDeleteUserWithDataLoading } =
    useDeleteUserWithDataMutation({
      onSuccess: () => {
        signOut();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.posts],
        });
      },
    });

  useEffect(() => {
    switch (mappedUserData) {
      case "NO_LOGGED_USER":
      case undefined:
        break;

      case "NO_USER_IN_AUTH":
        signOut();
        break;

      case "USER_IN_AUTH_BUT_NO_IN_USERS_TABLE":
        insertUserDataToDb(
          currentSession?.user || null,
          (userData: UserData) => setUserData(userData),
          signOut
        );
        break;

      default:
        if (JSON.stringify(userData) === JSON.stringify(mappedUserData)) return;
        setUserData(mappedUserData);
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSession, mappedUserData]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        setIsAuthLoading(false);
      } else {
        setIsAuthLoading(true);
      }

      if (event === "SIGNED_OUT") {
        console.info("---- 👋🏼 User signed out correctly. ----");
        signOut();
      } else if (event === "INITIAL_SESSION" && session) {
        console.info("---- ⚙️ Starting session refresh ----");
        const {
          data: { session: newSession },
          error: newSessionError,
        } = await supabaseClient.auth.refreshSession(session);

        if (newSessionError || !newSession) {
          throw new Error(
            `❌ ${
              newSessionError?.message ||
              "Something went wrong during refreshing session."
            }`
          );
        }

        setCurrentSession(newSession);
        console.info("---- ✅ Refreshed session - correct. ----");
      } else {
        setIsAuthLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          prompt: "select_account",
        },
      },
    });
  };

  const signOut = async () => {
    setUserData(null);
    if (currentSession) {
      await supabaseClient.auth.signOut();
    }
    setCurrentSession(null);
    navigate(ROUTES.root());
  };

  const unreadNotifications = notifications.filter(({ isRead }) => !isRead);

  const value: AuthContextType = {
    userData,
    notifications: {
      areUnread: !!unreadNotifications.length,
      unreadCount: unreadNotifications.length,
      list: notifications,
      loading: areNotificationsLoading,
    },
    currentSession,
    isDeleteUserWithDataLoading,
    isUserDataFetching,
    isAuthLoading,
    signInWithGoogle,
    signOut,
    deleteUserWithData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
