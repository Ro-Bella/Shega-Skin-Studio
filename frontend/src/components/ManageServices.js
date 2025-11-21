// src/components/ManageServices.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import './ManageServices.css';

const API_URL = 'http://localhost:5000/api';

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);
    const t = translations[language];

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/services`);
            setServices(response.data);
        } catch (err) {
            setError(t.manageServices.errorLoading);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [t]);

    const handleDelete = async (id) => {
        if (window.confirm(t.manageServices.deleteConfirm)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/services/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Refresh the list after deleting
                fetchServices();
            } catch (err) {
                setError(t.manageServices.errorDeleting);
            }
        }
    };

    if (loading) return <div>{t.loadingMessage}</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="manage-services-container">
            <div className="manage-services-header">
                <h1>{t.manageServices.title}</h1>
                <button onClick={() => navigate('/admin/add-service')} className="add-new-btn">
                    {t.manageServices.addNewButton}
                </button>
            </div>
            <div className="table-wrapper">
                <table className="services-table">
                    <thead>
                        <tr>
                            <th>{t.manageServices.tableHeaderName}</th>
                            <th>{t.manageServices.tableHeaderType}</th>
                            <th>{t.manageServices.tableHeaderPrice}</th>
                            <th>{t.manageServices.tableHeaderDuration}</th>
                            <th>{t.manageServices.tableHeaderActions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service._id}>
                                <td>{service.name}</td>
                                <td>{t.serviceTypes[service.type] || service.type}</td>
                                <td>{service.price} {t.priceUnit}</td>
                                <td>{service.durationMinutes} {t.manageServices.minutes}</td>
                                <td>
                                    <button onClick={() => navigate(`/admin/edit-service/${service._id}`)} className="edit-btn">{t.manageServices.editButton}</button>
                                    <button onClick={() => handleDelete(service._id)} className="delete-btn">{t.manageServices.deleteButton}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageServices;