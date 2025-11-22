// src/components/LoginPage.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import './LoginPage.css';

const API_URL = 'http://localhost:5000/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);
    const t = translations[language] || {}; // ትርጉሞች ከሌሉ ባዶ ኦብጀክት እንዲሆን

    return (
        <div className="login-container">
            {/* ወደ ኋላ ለመመለስ የተጨመረ ቁልፍ */}
            <button onClick={() => navigate(-1)} className="back-btn-login">
                &larr; {t.backButtonLogin}
            </button>
            <form onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                try {
                    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
                    localStorage.setItem('token', response.data.token);
                    navigate('/admin');
                } catch (err) {
                    setError(t.loginError || 'Invalid email or password.');
                    console.error('Login failed:', err);
                }
            }} className="login-form">
                <h2>{t.loginTitle || 'Admin Login'}</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="email">{t.loginEmailLabel || 'Email'}</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">{t.loginPasswordLabel || 'Password'}</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>
                <button type="submit" className="login-btn">{t.loginButton || 'Login'}</button>
            </form>
        </div>
    );
};

export default LoginPage;