import { FC, PropsWithChildren, useEffect, useState } from "react";
import { supabaseClient } from "../supabase-client";
import { User } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = () => {
    supabaseClient.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const signOut = () => {
    supabaseClient.auth.signOut();
  };

  const value = {
    user,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
