// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AppointmentForm from './components/AppointmentForm';
import AdminLogin from './components/AdminLogin';
import { LanguageProvider } from './components/LanguageContext';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import './App.css';
import AdminManagementLogin from './components/AdminManagementLogin';
import SuperAdminRoute from './components/SuperAdminRoute';
import AdminManagement from './components/AdminManagement';
import ServiceManagement from './components/ServiceManagement';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/book" element={<AppointmentForm />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/management-login" element={<AdminManagementLogin />} />
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route element={<SuperAdminRoute />}>
                <Route path="/admin/management" element={<AdminManagement />} />
              </Route>
              <Route path="/admin/services" element={<ServiceManagement />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
