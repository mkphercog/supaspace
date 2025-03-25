import { createContext } from "react";
import { User } from "@supabase/supabase-js";

export type AuthContextType = {
  user: User | null;
  signInWithGoogle: () => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
