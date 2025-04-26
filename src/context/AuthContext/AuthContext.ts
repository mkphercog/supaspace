import { createContext } from "react";
import { DbUserDataType } from "../../types/users";
import { Session } from "@supabase/supabase-js";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

export type AuthContextType = {
  dbUserData: DbUserDataType | null;
  currentSession: Session | null;
  isAdmin: boolean | null;
  isDeleteUserWithDataLoading: boolean;
  isUserDataFetching: boolean;
  isAuthLoading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
  deleteUserWithData: UseMutateAsyncFunction<void, Error, void, unknown>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
