import { FC, PropsWithChildren, useEffect, useState } from "react";
import { supabaseClient } from "../supabase-client";
import { User } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../api/queryKeys";

const ADMIN_ID = import.meta.env.VITE_SUPABASE_ADMIN_ID;

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      supabaseClient.auth
        .refreshSession(session)
        .then(({ data: { session } }) => {
          setUser(session?.user ?? null);
        });
    });

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_, session) => {
        const isAdminLoggedIn = session?.user.id === ADMIN_ID;
        setUser(session?.user ?? null);
        setIsAdmin(isAdminLoggedIn);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signInWithGoogle = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const signOut = async () => {
    await supabaseClient.auth.signOut();
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
      setUser(null);
      navigate({ pathname: "/" });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
      alert("Your account and data deleted successfully.");
    } else {
      alert("An error occurred while deleting your account and user data.");
    }
  };

  const value = {
    user,
    isAdmin,
    signInWithGoogle,
    signOut,
    deleteUserAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
