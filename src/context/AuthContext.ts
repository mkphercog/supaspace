import { createContext } from "react";
import { User } from "@supabase/supabase-js";

export type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
  deleteUserAccount: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
