// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppointmentForm from './components/AppointmentForm';
import { LanguageProvider, LanguageContext } from './components/LanguageContext';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import AdminLayout from './components/AdminLayout';
import ChangePassword from './components/ChangePassword'; // የይለፍ ቃል መቀየሪያ ኮምፖነንት
import RequestPasswordReset from './components/RequestPasswordReset'; // የይለፍ ቃል ማስጀመሪያ ኮምፖነንት
import ResetPassword from './components/ResetPassword'; // የይለፍ ቃል መቀየሪያ ኮምፖነንት
import './App.css';
import ManageServices from './components/ManageServices'; // የአገልግሎት ማስተዳደሪያ ገጽ
import ServiceForm from './components/ServiceForm'; // የአገልግሎት ማስገቢያ ቅጽ
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
    <div className="App">
      <Router>
        <LanguageProvider>
          <Routes>
            {/* የመነሻ ገጽ እና የቀጠሮ ማስያዣ ገጾች (ራውቲንግ ተሻሽሏል) */}
            <Route path="/" element={<LandingPageWrapper />} />
            <Route path="/book" element={<AppointmentFormWrapper />} />
            
            {/* የመግቢያ ገጽ */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<RequestPasswordReset />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* በይለፍ ቃል የተጠበቀው የአስተዳዳሪ ዳሽቦርድ */}
            <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin-actions" element={<AdminActions />} />
              <Route path="admin/change-password" element={<ChangePassword />} />
              <Route path="admin/manage-services" element={<ManageServices />} />
              <Route path="admin/add-service" element={<ServiceForm />} />
              <Route path="admin/edit-service/:id" element={<ServiceForm />} />
              {/* ሌሎች የአስተዳዳሪ ገጾችን እዚህ ማከል ይቻላል */}
            </Route>
          </Routes>
        </LanguageProvider>
      </Router>
    </div>
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
