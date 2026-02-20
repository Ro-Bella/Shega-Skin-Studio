// frontend/src/components/AdminLogin.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import './AdminLogin.css'; // ቅጥን ለመጋራት
import api from '../api';

const AdminLogin = () => {
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
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post(
        `/admin/login`,
        { email, password }
      );

      // ቶክኑን እና የተጠቃሚ መረጃን localStorage ላይ ማስቀመጥ
      localStorage.setItem('adminInfo', JSON.stringify(data));

      navigate('/admin/dashboard'); // ወደ አስተዳደር ገጽ መምራት
    } catch (err) {
      const messageKey = err.response?.data?.messageKey;
      const defaultMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      // Use translation if key exists, otherwise use the direct message from backend or a default one.
      setError(messageKey && t[messageKey] ? t[messageKey] : defaultMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="dashboard-header">
          <Link to="/" className="back-link"> &larr; {t.backButton}</Link>
          <h1 className="title-gradient">{t.adminLogin}</h1>
        </div>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="appointment-form admin-login-form">
          <div className="appointment-form-group">
            <label htmlFor="email">{t.email}:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="search-input" // ይህን class ጨምረናል
              required
            />
          </div>
          <div className="appointment-form-group">
            <label htmlFor="password">{t.password}:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="search-input" // ይህን class ጨምረናል
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

export default AdminLogin;