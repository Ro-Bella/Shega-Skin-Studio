// frontend/src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const adminInfo = localStorage.getItem('adminInfo');

  // ተጠቃሚው ሎጊን ካደረገ ገጹን ያሳያል፣ ካልሆነ ወደ ሎጊን ገጽ ይመራዋል።
  return adminInfo ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;