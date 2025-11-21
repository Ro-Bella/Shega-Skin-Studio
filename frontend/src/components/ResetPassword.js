// src/components/ResetPassword.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import './LoginPage.css';

const API_URL = 'http://localhost:5000/api';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();
    const { language, translations } = useContext(LanguageContext);
    const t = translations[language];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (password !== confirmPassword) {
            setMessage(t.newPasswordMismatchError);
            setLoading(false);
            return;
        }

        try {
            await axios.put(`${API_URL}/auth/reset-password/${token}`, { password });
            setMessage(t.passwordResetSuccessMessage);
            setTimeout(() => navigate('/login'), 3000); // ከተሳካ በኋላ ወደ መግቢያ ገጽ ይመለሳል
        } catch (err) {
            setMessage(t.passwordResetErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>{t.resetPasswordTitle}</h2>
                {message && <p className={`form-message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}
                
                <div className="form-group">
                    <label htmlFor="password">{t.newPasswordLabel}</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">{t.confirmNewPasswordLabel}</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? <div className="spinner-light"></div> : t.resetPasswordButton}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;