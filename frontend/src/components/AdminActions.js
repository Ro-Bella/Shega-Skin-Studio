// src/components/AdminActions.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminActions.css';
import { LanguageContext } from './LanguageContext';

const AdminActions = () => {
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext) || {};
    const t = translations[language] || {};

    // እነዚህ ተግባራት ወደፊት ለሚሰሩ ገጾች የሚሆኑ ናቸው
    const handleManageServices = () => navigate('/admin/manage-services');
    const handleViewReports = () => navigate('/reports');
    const handleChangePassword = () => navigate('/admin/change-password'); // የይለፍ ቃል ለመቀየር
    const handleRegisterAdmin = () => navigate('/admin/register'); // አዲስ አስተዳዳሪ ለመመዝገብ

    return (
        <div className="admin-actions-container">
            <div className="admin-actions-header">
                <button onClick={() => navigate(-1)} className="back-btn-admin-corner">
                    &larr; {t.backButton}
                </button>
                <h1>{t.adminActionsTitle}</h1>
            </div>
            <p className="admin-actions-description">{t.adminActionsDescription}</p>
            <div className="actions-grid">
                <button className="action-card" onClick={handleManageServices}>
                    <span className="action-icon">🛠️</span>
                    <h3>{t.manageServices?.link}</h3>
                </button>
                <button className="action-card" onClick={handleViewReports}>
                    <span className="action-icon">📊</span>
                    <h3>{t.viewReports}</h3>
                </button>
                <button className="action-card" onClick={handleChangePassword}>
                    <span className="action-icon">🔑</span>
                    <h3>{t.changePasswordAction}</h3>
                </button>
                <button className="action-card" onClick={handleRegisterAdmin}>
                    <span className="action-icon">👤+</span>
                    <h3>{t.addNewAdminAction}</h3>
                </button>
            </div>
        </div>
    );
};

export default AdminActions;