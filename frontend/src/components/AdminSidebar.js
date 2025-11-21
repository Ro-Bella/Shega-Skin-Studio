// src/components/AdminSidebar.js
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminSidebar.css';
import { LanguageContext } from './LanguageContext';

const AdminSidebar = () => {
    const { language, translations } = useContext(LanguageContext);
    const t = translations[language]?.adminSidebar;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!t) {
        return null; // ትርጉሞች እስኪጫኑ ይጠብቃል
    }

    return (
        <aside className="admin-sidebar">
            <h2 className="sidebar-title">{t.title}</h2>
            <nav className="sidebar-nav">
                <NavLink to="/admin" end>{t.dashboard}</NavLink>
                <NavLink to="/admin-actions">{t.actions}</NavLink>
                {/* ለሪፖርቶች የሚሆን ሊንክ ወደፊት ሲጨመር */}
                {/* <NavLink to="/admin/reports">{t.reports}</NavLink> */}
            </nav>
            <button onClick={handleLogout} className="sidebar-logout-btn">
                {t.logout}
            </button>
        </aside>
    );
};

export default AdminSidebar;