import React from "react";
import { Navigate, Outlet } from "react-router";
import { useUserStore } from "../store/useUserStore";

const ProtectedRoute: React.FC = () => {
  const { user } = useUserStore();

  if (!user || Object.keys(user).length === 0) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
