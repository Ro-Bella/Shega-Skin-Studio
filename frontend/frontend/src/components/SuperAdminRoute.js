// frontend/src/components/SuperAdminRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const SuperAdminRoute = () => {
  const hasAccess = sessionStorage.getItem('superAdminAccess') === 'true';
  return hasAccess ? <Outlet /> : <Navigate to="/admin/management-login" replace />;
};

export default SuperAdminRoute;