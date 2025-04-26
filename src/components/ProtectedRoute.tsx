import { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  mustBeAdmin?: boolean;
};

export const ProtectedRoute: FC<PropsWithChildren<ProtectedRouteProps>> = ({
  mustBeAdmin,
  children,
}) => {
  const { currentSession, isAuthLoading, isAdmin } = useAuth();

  if (isAuthLoading) return null;

  const isCorrectRole = mustBeAdmin ? isAdmin : true;

  if (!currentSession || !isCorrectRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
