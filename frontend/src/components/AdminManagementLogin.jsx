// frontend/src/components/AdminManagementLogin.js
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import './AdminManagementLogin.css';
import API_BASE_URL from '../api/config';

const AdminManagementLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language, translations } = useContext(LanguageContext);
  const t = translations[language];

  // ተጠቃሚው ከገጹ ሲወጣ የገባውን ዳታ ለማጽዳት
  useEffect(() => {
    return () => {
      setEmail('');
      setPassword('');
      setError('');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      await axios.post(
        `${API_BASE_URL}/api/admin/super-login`,
        { email, password },
        config
      );

      // Store a flag in sessionStorage to indicate super admin access
      sessionStorage.setItem('superAdminAccess', 'true');

      navigate('/admin/management'); // Redirect to the actual management page
    } catch (err) {
      // ከ Backend የሚመጣውን messageKey በመጠቀም ትክክለኛውን የስህተት መልዕክት እናሳያለን።
      const messageKey = err.response?.data?.messageKey || 'superAdminAuthFailed';
      // ከቋንቋ ፋይሉ ላይ ትርጉሙን እናገኛለን፣ ከሌለ የእንግሊዝኛውን ነባሪ መልዕክት እንጠቀማለን።
      const errorMessage = t[messageKey] || 'Authentication failed. You are not authorized.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="dashboard-container" style={{ maxWidth: '800px', width: '90%', padding: '3rem' }}>
        <div className="dashboard-header">
        <Link to="/admin/dashboard" className="back-link"> &larr; {t.backButton}</Link>
        <h1 className="title-gradient">{t.adminManagement}</h1>
        </div>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="appointment-form-group">
          <label htmlFor="email">{t.superAdminEmailLabel}:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="appointment-form-group">
          <label htmlFor="password">{t.superAdminPasswordLabel}:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-confirm" disabled={loading}>
          {loading ? t.sending : t.submit}
        </button>
      </form>
      </div>
    </div>
  );
};

export default AdminManagementLogin;