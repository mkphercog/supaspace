import { FC, PropsWithChildren, useEffect, useState } from "react";
import { supabaseClient } from "../supabase-client";
import { Session } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../api/queryKeys";
import { fetchUserData, insertUserDataToDb } from "../api/users";
import { DbUserDataType } from "../types/users";

const ADMIN_ID = import.meta.env.VITE_SUPABASE_ADMIN_ID;

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [dbUserData, setDbUserData] = useState<DbUserDataType | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: loggedUserData } = useQuery({
    queryFn: () => {
      return fetchUserData(currentSession?.user.id);
    },
    queryKey: [QUERY_KEYS.me, currentSession?.user.id],
    retry: false,
  });

  useEffect(() => {
    if (loggedUserData === undefined) return;

    if (loggedUserData) {
      console.info(
        "---- ℹ️ The user already exists in the DB, no action needed. ----"
      );
      setDbUserData(loggedUserData);
    } else if (currentSession) {
      console.info(
        "---- ⚙️ No user in the DB, starting the process of adding.  ----"
      );
      insertUserDataToDb(currentSession?.user, setDbUserData);
    }
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
  };

  const deleteUserAccount = async () => {
    const session = await supabaseClient.auth.getSession();
    const { error } = await supabaseClient.functions.invoke(
      "delete-user-with-data",
      {
        headers: {
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
      }
    );

    if (!error) {
      signOut();
      navigate({ pathname: "/" });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
      alert("Your account and data deleted successfully.");
    } else {
      alert("An error occurred while deleting your account and user data.");
    }
  };

  const value = {
    dbUserData,
    currentSession,
    isAdmin,
    signInWithGoogle,
    signOut,
    deleteUserAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
