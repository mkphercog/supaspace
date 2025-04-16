import { FC, PropsWithChildren, useEffect, useState } from "react";
import { supabaseClient } from "../supabase-client";
import { Session } from "@supabase/supabase-js";
import { AuthContext, AuthContextType } from "./AuthContext";
import { useNavigate } from "react-router";
import {
  insertUserDataToDb,
  useDeleteUserWithData,
  useFetchUserData,
} from "../api/users";
import { DbUserDataType } from "../types/users";
import { QUERY_KEYS } from "../api/queryKeys";
import { useQueryClient } from "@tanstack/react-query";

const ADMIN_ID = import.meta.env.VITE_SUPABASE_ADMIN_ID;

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [dbUserData, setDbUserData] = useState<DbUserDataType | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { data: loggedUserData } = useFetchUserData(currentSession?.user.id);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: deleteUserWithData, isPending: isDeleteUserWithDataPending } =
    useDeleteUserWithData({
      onSuccess: () => {
        signOut();
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
        alert("Your account and data deleted successfully.");
      },
    });

  useEffect(() => {
    switch (loggedUserData) {
      case "NO_LOGGED_USER":
      case undefined:
        break;

      case "NO_USER_IN_AUTH":
        signOut();
        break;

      case "USER_IN_AUTH_BUT_NO_IN_USERS_TABLE":
        insertUserDataToDb(
          currentSession?.user || null,
          setDbUserData,
          signOut
        );
        break;

      default:
        if (dbUserData === loggedUserData) return;
        setDbUserData(loggedUserData);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSession, loggedUserData]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
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
        setIsAdmin(newSession.user.id === ADMIN_ID);
        console.info("---- ✅ Refreshed session - correct. ----");
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
    });
  };

  const signOut = async () => {
    if (currentSession) {
      await supabaseClient.auth.signOut();
    }
    setCurrentSession(null);
    setDbUserData(null);
    setIsAdmin(false);
    navigate({ pathname: "/" });
  };

  const value: AuthContextType = {
    dbUserData,
    currentSession,
    isAdmin,
    signInWithGoogle,
    signOut,
    deleteUserWithData,
    isDeleteUserWithDataPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
