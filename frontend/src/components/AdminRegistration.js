// src/components/AdminRegistration.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import './AdminRegistration.css';

const API_URL = 'http://localhost:5000/api';

const AdminRegistration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);
    const t = translations[language] || {}; // ትርጉሞች ከሌሉ ባዶ ኦብጀክት እንዲሆን

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.post(`${API_URL}/auth/register`, { email, password }, config);

            setMessage(t.registrationSuccessMessage || '✅ New admin registered successfully.');
            setEmail('');
            setPassword('');

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setMessage(`${t.registrationErrorMessage || '❌ Error registering new admin:'} ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-registration-container">
            <button onClick={() => navigate(-1)} className="back-btn-login" aria-label="Back">
                &larr; {t.backButtonLogin || 'Back'}
            </button>
            <form onSubmit={handleSubmit} className="admin-registration-form">
                <h2>{t.adminRegistrationTitle || 'Register New Admin'}</h2>
                {message && <p className={`form-message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}
                <div className="form-group">
                    <label htmlFor="email">{t.newAdminEmailLabel || 'New Admin Email'}</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required                        
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">{t.newAdminPasswordLabel || 'Password'}</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? <div className="spinner"></div> : (t.registerButton || 'Register Admin')}
                </button>
            </form>
        </div>
    );
};

export default AdminRegistration;