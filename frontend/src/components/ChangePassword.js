// src/components/ChangePassword.js
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import './ChangePassword.css';

const API_URL = 'http://localhost:5000/api';

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [visibility, setVisibility] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [validation, setValidation] = useState({
        length: false,
        match: false,
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);
    const t = translations[language];

    useEffect(() => {
        const isLengthValid = passwords.newPassword.length >= 8;
        const doPasswordsMatch = passwords.newPassword && passwords.newPassword === passwords.confirmNewPassword;
        setValidation({ length: isLengthValid, match: doPasswordsMatch });
    }, [passwords]);

    const toggleVisibility = (field) => {
        setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!validation.length || !validation.match) {
            setMessage(t.newPasswordMismatchError);
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.put(`${API_URL}/auth/change-password`, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            }, config);

            setMessage(t.passwordChangeSuccessMessage);
            setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setMessage(`${t.passwordChangeErrorMessage} ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-container">
            <form onSubmit={handleSubmit} className="change-password-form">
                <div className="form-header-admin">
                    <h2>{t.changePasswordTitle}</h2>
                    <button type="button" onClick={() => navigate(-1)} className="back-btn-admin-corner">&larr; {t.backButton}</button>
                </div>
                {message && <p className={`form-message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}
                
                <div className="form-group password-input-group">
                    <label htmlFor="currentPassword">{t.currentPasswordLabel}</label>
                    <input
                        type={visibility.current ? 'text' : 'password'}
                        id="currentPassword" name="currentPassword"
                        value={passwords.currentPassword} onChange={handleChange} required
                    />
                    <span onClick={() => toggleVisibility('current')} className="password-toggle-icon">
                        {visibility.current ? '🙈' : '👁️'}
                    </span>
                </div>

                <div className="form-group password-input-group">
                    <label htmlFor="newPassword">{t.newPasswordLabel}</label>
                    <input
                        type={visibility.new ? 'text' : 'password'}
                        id="newPassword" name="newPassword"
                        value={passwords.newPassword} onChange={handleChange} required
                    />
                    <span onClick={() => toggleVisibility('new')} className="password-toggle-icon">
                        {visibility.new ? '🙈' : '👁️'}
                    </span>
                </div>

                <div className="form-group password-input-group">
                    <label htmlFor="confirmNewPassword">{t.confirmNewPasswordLabel}</label>
                    <input
                        type={visibility.confirm ? 'text' : 'password'}
                        id="confirmNewPassword" name="confirmNewPassword"
                        value={passwords.confirmNewPassword} onChange={handleChange} required
                    />
                    <span onClick={() => toggleVisibility('confirm')} className="password-toggle-icon">
                        {visibility.confirm ? '🙈' : '👁️'}
                    </span>
                </div>

                {passwords.newPassword && (
                    <div className="password-validation-rules">
                        <p className={validation.length ? 'valid' : 'invalid'}>
                            {validation.length ? '✅' : '❌'} {t.passwordLengthRequirement}
                        </p>
                        {passwords.confirmNewPassword && (
                             <p className={validation.match ? 'valid' : 'invalid'}>
                                {validation.match ? '✅' : '❌'} {t.passwordsMustMatch}
                            </p>
                        )}
                    </div>
                )}


                <button type="submit" className="submit-btn" disabled={loading || !validation.length || !validation.match}>
                    {loading ? <div className="spinner"></div> : t.changePasswordButton}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;