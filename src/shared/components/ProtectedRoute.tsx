import { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router";

import { useAuth } from "src/context";

export const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const { currentSession, isAuthLoading } = useAuth();

  if (isAuthLoading) return null;

  if (!currentSession) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
