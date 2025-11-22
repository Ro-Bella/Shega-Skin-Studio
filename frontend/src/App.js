// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppointmentForm from './components/AppointmentForm';
import { LanguageProvider, LanguageContext } from './components/LanguageContext';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import AdminRegistration from './components/AdminRegistration';
import AdminLayout from './components/AdminLayout';
import ChangePassword from './components/ChangePassword'; // የይለፍ ቃል መቀየሪያ ኮምፖነንት
import './App.css';
import ManageServices from './components/ManageServices'; // የአገልግሎት ማስተዳደሪያ ገጽ
import AdminActions from './components/AdminActions';

// ያልገባ ተጠቃሚ ወደ ዳሽቦርዱ እንዳይገባ የሚከለክል ኮምፖነንት
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // ቶክንን ከ local storage ማግኘት
  if (!token) {
    // ቶክን ከሌለ ወደ መግቢያ ገጽ መመለስ
    return <Navigate to="/login" replace />;
  }
  return children; // ቶክን ካለ ዳሽቦርዱን ማሳየት
};





function App() {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPageWrapper />} />
          <Route path="/book" element={<AppointmentFormWrapper />} />
          <Route path="/login" element={<LoginPage />} />
          

          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="actions" element={<AdminActions />} />
            <Route path="manage-services" element={<ManageServices />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="register" element={<AdminRegistration />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </Router>
  );
}

// ራውቲንግን ለማስተካከል የሚረዱ ረዳት ኮምፖነንቶች
const LandingPageWrapper = () => {
  const navigate = useNavigate();
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];
  return <LandingPage onNavigateToForm={() => navigate('/book')} t={t} />;
};

const AppointmentFormWrapper = () => {
  const navigate = useNavigate();
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];

  return <AppointmentForm onBackToHome={() => navigate('/')} onAppointmentBooked={() => {}} t={t} />;
};


export default App;
