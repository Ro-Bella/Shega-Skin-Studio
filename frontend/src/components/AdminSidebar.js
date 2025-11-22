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
            <div className="sidebar-top">
                <h2 className="sidebar-title">{t.title}</h2>
                <nav className="sidebar-nav">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>{t.dashboard}</NavLink>
                    <NavLink to="/admin/actions" className={({ isActive }) => isActive ? 'active' : ''}>{t.actions}</NavLink>
                </nav>
            </div>
            <div className="sidebar-bottom">
                <button onClick={handleLogout} className="sidebar-logout-btn">
                    {t.logout}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;