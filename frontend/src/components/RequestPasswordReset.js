// src/components/RequestPasswordReset.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import './LoginPage.css'; // ከLogin ገጽ ጋር ተመሳሳይ ቅጥ እንጠቀማለን

const API_URL = 'http://localhost:5000/api';

const RequestPasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);
    const t = translations[language];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.post(`${API_URL}/auth/forgot-password`, { email });
            setMessage(t.resetLinkSuccessMessage);
        } catch (err) {
            // ከ Backend የሚመጣውን ትክክለኛ የስህተት መልዕክት እናሳይ
            const errorMessage = err.response?.data?.message || t.resetLinkErrorMessage;
            setMessage(`❌ ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <button onClick={() => navigate(-1)} className="back-btn-login">
                &larr; {t.backButtonLogin}
            </button>
            <form onSubmit={handleSubmit} className="login-form">
                <h2>{t.requestResetTitle}</h2>
                <p className="form-instruction">{t.requestResetInstruction}</p>
                {message && <p className={`form-message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}
                
                <div className="form-group">
                    <label htmlFor="email">{t.loginEmailLabel}</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? <div className="spinner-light"></div> : t.sendResetLinkButton}
                </button>
            </form>
        </div>
    );
};

export default RequestPasswordReset;