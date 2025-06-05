import { Session } from "@supabase/supabase-js";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { createContext } from "react";

import { Notification, UserData } from "src/types";

export type AuthContextType = {
  userData: UserData | null;
  notifications: {
    areUnread: boolean;
    list: Notification[];
    loading: boolean;
  };
  currentSession: Session | null;
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
