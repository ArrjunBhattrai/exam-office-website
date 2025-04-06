import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({children, allowedRoles}) => {
    const {token, role} = useSelector((state) => state.auth.token);

    if(!token) {
        return <Navigate to="/unauthorized" />
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" />;
      }

      return children;
};

export default ProtectedRoute;