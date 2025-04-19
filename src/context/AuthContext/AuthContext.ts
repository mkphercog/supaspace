import { createContext } from "react";
import { DbUserDataType } from "../../types/users";
import { Session } from "@supabase/supabase-js";

export type AuthContextType = {
  dbUserData: DbUserDataType | null;
  currentSession: Session | null;
  isAdmin: boolean | null;
  signInWithGoogle: () => void;
  signOut: () => void;
  deleteUserWithData: () => void;
  isDeleteUserWithDataPending: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
