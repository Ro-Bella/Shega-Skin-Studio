// frontend/src/components/ServiceManagement.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { LanguageContext } from './LanguageContext';
import './ServiceManagement.css'; // ቅሉን ከዳሽቦርዱ ጋር እንዲጋራ
import API_BASE_URL from '../api/config';

const API_URL = `${API_BASE_URL}/api/services`;

const ServiceManagement = () => {
  const { language, translations } = useContext(LanguageContext);
  const currentText = translations[language];
  const navigate = useNavigate(); // Initialize useNavigate

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceName, setServiceName] = useState('');
  const [error, setError] = useState(''); // Add error state

  // ሁሉንም አገልግሎቶች መጫን
  // Function to get auth header with token
  const getConfig = () => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminInfo?.token}`,
      },
    };
  };
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(API_URL, getConfig()); // Pass auth header
        setServices(response.data);
      } catch (err) {
        setError('ስህተት: አገልግሎቶችን ማምጣት አልተቻለም።');
        if (err.response && err.response.status === 401) {
          navigate('/admin/login'); // Redirect to login if unauthorized
        }
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [navigate]); // Add navigate to dependency array

  // አዲስ አገልግሎት መፍጠር
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    try {
      const response = await axios.post(API_URL, { name: serviceName }, getConfig()); // Pass auth header
      setServices([...services, response.data]);
      setServiceName(''); // input መስኩን ባዶ ማድረግ
    } catch (err) {
      alert(`ስህተት: ${err.response?.data?.message || 'አገልግሎቱን መጨመር አልተቻለም'}`);
      if (err.response && err.response.status === 401) {
        navigate('/admin/login'); // Redirect to login if unauthorized
      }
    }
  };

  // አገልግሎትን ለመሰረዝ
  const handleDelete = async (id) => {
    if (window.confirm(currentText.deleteConfirmService)) {
      try {
        await axios.delete(`${API_URL}/${id}`, getConfig()); // Pass auth header
        setServices(services.filter(service => service._id !== id));
        alert(currentText.serviceDeleted);
      } catch (err) {
        alert(`ስህተት: ${err.response?.data?.message || 'አገልግሎቱን መሰረዝ አልተቻለም'}`);
        if (err.response && err.response.status === 401) {
          navigate('/admin/login'); // Redirect to login if unauthorized
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  if (loading) return <div>{currentText.loading}</div>;
  if (error) return <div className="dashboard-container error"><h2>{error}</h2></div>; // Display error

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Link to="/admin/dashboard" className="back-link"> &larr; {currentText.backButton}</Link>
        <h1 className="title-gradient">{currentText.serviceManagement}</h1>
      </div>

      {/* አዲስ አገልግሎት መፍጠሪያ ፎርም */}
      <form onSubmit={handleSubmit} className="appointment-form service-management-section" style={{ marginBottom: '2rem' }}>
        <h3>{currentText.addNewService}</h3>
        <div className="appointment-form-group">
          <label htmlFor="serviceName">{currentText.serviceName}:</label>
          <input type="text" id="serviceName" value={serviceName} onChange={(e) => setServiceName(e.target.value)} required />
        </div>
        <button type="submit" className="btn-confirm">{currentText.submit}</button>
      </form>

      {/* የአገልግሎቶች ዝርዝር */}
      <div className="service-management-section">
        <h3>{currentText.serviceList}</h3>
        <ul className="service-list">
          {services.map((service) => (
            <li key={service._id}>
              <span>{service.name}</span>
              <button onClick={() => handleDelete(service._id)} className="btn-cancel">
                {currentText.delete}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceManagement;
