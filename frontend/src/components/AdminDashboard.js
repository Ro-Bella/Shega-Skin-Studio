// src/components/AdminDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate አሁንም ለ error handling ያስፈልጋል
import AppointmentList from './AppointmentList'; // AppointmentList ኮምፖነንትን እናስገባለን
import './AdminDashboard.css'; // ለዳሽቦርዱ ገጽታ የሚሆን CSS ፋይል
import { LanguageContext } from './LanguageContext';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = ({ onBackToHome }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { language, translations, setLanguage } = useContext(LanguageContext);
    const t = translations[language];

    

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.get(`${API_URL}/appointments`, config);
                // ቀጠሮዎችን በቀን እና በሰዓት መደርደር
                const sortedAppointments = response.data.sort((a, b) => new Date(a.date) - new Date(b.date) || a.startTime.localeCompare(b.startTime));
                setAppointments(sortedAppointments);
                setError('');
            } catch (err) {
                setError(t.errorLoadingAppointments);
                console.error("Error fetching appointments:", err);
                if (err.response && err.response.status === 401) {
                    // ቶክኑ ትክክል ካልሆነ ወደ መግቢያ ገጽ መመለስ
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [navigate, t]);

    if (!t) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>{t.adminDashboardTitle}</h1>
            </div>
            {loading && <h2>{t.loadingAppointments}</h2>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && appointments.length === 0 ? (
                <p>{t.noAppointments}</p>
            ) : ( // እዚህ ጋር AppointmentList ኮምፖነንትን እንጠቀማለን
                <AppointmentList appointments={appointments} t={t} />
            )} 
        </div>
    );
};

export default AdminDashboard;