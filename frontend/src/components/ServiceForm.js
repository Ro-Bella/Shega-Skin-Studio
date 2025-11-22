// src/components/ServiceForm.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import './ServiceForm.css';

const API_URL = 'http://localhost:5000/api';

const ServiceForm = () => {
    const { id } = useParams(); // For editing
    const isEditing = !!id;
    const navigate = useNavigate();
    const { language, translations } = useContext(LanguageContext);
    const t = translations[language];

    const [formData, setFormData] = useState({
        name: '',
        type: 'type1',
        price: '',
        durationMinutes: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isEditing) {
            const fetchService = async () => {
                try {
                    const response = await axios.get(`${API_URL}/services/${id}`);
                    setFormData(response.data);
                } catch (error) {
                    setMessage(t.serviceForm.errorFetching);
                }
            };
            fetchService();
        }
    }, [id, isEditing, t]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            if (isEditing) {
                await axios.put(`${API_URL}/services/${id}`, formData, config);
            } else {
                await axios.post(`${API_URL}/services`, formData, config);
            }
            setMessage(isEditing ? t.serviceForm.updateSuccess : t.serviceForm.createSuccess);
            setTimeout(() => navigate('/admin/manage-services'), 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setMessage(`${isEditing ? t.serviceForm.updateError : t.serviceForm.createError} ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const serviceTypes = Object.keys(t.serviceTypes || {});

    return (
        <div className="service-form-container">
            <form onSubmit={handleSubmit} className="service-form">
                <div className="form-header-admin">
                    <h2>{isEditing ? t.serviceForm.editTitle : t.serviceForm.addTitle}</h2>
                    <button type="button" onClick={() => navigate(-1)} className="back-btn-admin-corner">&larr; {t.backButton || 'Back'}</button>
                </div>
                {message && <p className={`form-message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}
                
                <div className="form-group">
                    <label htmlFor="name">{t.serviceForm.nameLabel}</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="type">{t.serviceForm.typeLabel}</label>
                    <select id="type" name="type" value={formData.type} onChange={handleChange} required>
                        {serviceTypes.map(typeKey => (
                            <option key={typeKey} value={typeKey}>{t.serviceTypes[typeKey]}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="price">{t.serviceForm.priceLabel}</label>
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="durationMinutes">{t.serviceForm.durationLabel}</label>
                    <input type="number" id="durationMinutes" name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} required />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? <div className="spinner"></div> : (isEditing ? t.serviceForm.saveButton : t.serviceForm.addButton)}
                </button>
            </form>
        </div>
    );
};

export default ServiceForm;