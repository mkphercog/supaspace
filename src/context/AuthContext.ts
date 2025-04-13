import { createContext } from "react";
import { DbUserDataType } from "../types/users";
import { Session } from "@supabase/supabase-js";

export type AuthContextType = {
  dbUserData: DbUserDataType | null;
  currentSession: Session | null;
  isAdmin: boolean | null;
  signInWithGoogle: () => void;
  signOut: () => void;
  deleteUserAccount: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
