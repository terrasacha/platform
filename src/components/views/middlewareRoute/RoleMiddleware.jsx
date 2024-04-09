
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleMiddleware({ children, allowedRoles, redirectPath }) {
  const userRole = localStorage.getItem('role');

  if (!userRole) {
    return <Navigate to='/login' replace />;
  } else if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}