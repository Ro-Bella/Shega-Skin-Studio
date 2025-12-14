// AppointmentForm.jsx (Frontend)

import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios'; // ለጊዜው ኮመንት እናድርገው
import './AppointmentForm.css'; // Importing CSS for styling
// import { LanguageContext } from '../contexts/LanguageContext'; // For multi-language support (Assuming this file exists)

// Backend API Base URL
const API_URL = 'http://localhost:5000/api';

const AppointmentForm = () => {
  // Using LanguageContext for translations
  // const { language = 'am', translations = {} } = useContext(LanguageContext) || {};
  const currentText = {}; // ለጊዜው ባዶ እናድርገው

  // State for form data
  const [formData, setFormData] = useState({
    fullName: '', // ከዚህ በፊት 'name' ነበር፣ ወደ 'fullName' ተቀይሯል
    phone: '',
    service: '',
    date: '',
    timeSlot: '',
  });

  // States for services, loading status, and messages
  const [services, setServices] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch services when the component mounts
  // useEffect(() => {
  //   const fetchServices = async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}/services`);
  //       setServices(response.data.data || []);
  //     } catch (error) {
  //       console.error("Failed to fetch services:", error);
  //       setMessage(currentText.serviceFetchError || 'አገልግሎቶችን ማምጣት አልተቻለም።');
  //     }
  //   };
  //   fetchServices();
  // }, [currentText.serviceFetchError]);

  // Fetch available time slots when date or service changes
  // useEffect(() => {
  //   if (formData.date && formData.service) {
  //     const fetchAvailableTimes = async () => {
  //       try {
  //         const response = await axios.get(`${API_URL}/available-times?date=${formData.date}&service=${formData.service}`);
  //         setAvailableTimes(response.data.data || []);
  //       } catch (error) {
  //         console.error("Failed to fetch available times:", error);
  //         setMessage(currentText.timeFetchError || 'የሚገኙ ሰዓቶችን ማምጣት አልተቻለም።');
  //         setAvailableTimes([]);
  //       }
  //     };
  //     fetchAvailableTimes();
  //   } else {
  //     setAvailableTimes([]);
  //   }
  // }, [formData.date, formData.service, currentText.timeFetchError]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(currentText.loadingMessage || 'እየላክን ነው...');

    // try {
    //   const response = await axios.post(`${API_URL}/appointments`, formData);
    //   setMessage(currentText.successMessage || `✅ ቀጠሮ በተሳካ ሁኔታ ተይዟል!`);
    //   // Reset form
    //   setFormData({ fullName: '', phone: '', service: '', date: '', timeSlot: '' });
    // } catch (error) {
    //   const errorMessage = error.response?.data?.message || error.message;
    //   setMessage(`${currentText.errorMessage || '❌ ስህተት:'} ${errorMessage}`);
    // } finally {
    //   setLoading(false);
    // }
    console.log('የተላከው ዳታ:', formData);
    alert('ቀጠሮዎ በተሳካ ሁኔታ ተይዟል!');
  };

  return (
    <div className="appointment-form-container">
      <h2>{currentText.formTitle || 'ቀጠሮ ማስገቢያ ቅጽ'}</h2>
      {message && <p className={`form-message ${message.includes('❌') ? 'error' : 'success'}`}>{message}</p>}
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-card">
          <h3>{currentText.clientInfoTitle || 'የደንበኛ መረጃ'}</h3>
          <div className="form-group">
            <label htmlFor="fullName">{currentText.clientNameLabel || 'ሙሉ ስም'}:</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">{currentText.clientPhoneLabel || 'ስልክ ቁጥር'}:</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-card">
          <h3>{currentText.serviceInfoTitle || 'የአገልግሎት መረጃ'}</h3>
          <div className="form-group">
            <label htmlFor="service">{currentText.serviceLabel || 'አገልግሎት'}:</label>
            <select id="service" name="service" value={formData.service} onChange={handleChange} required>
              <option value="">{currentText.selectServicePlaceholder || '-- አገልግሎት ይምረጡ --'}</option>
              {/* Static options for now */}
              <option value="General Checkup">አጠቃላይ ምርመራ</option>
              <option value="Dental">የጥርስ ህክምና</option>
              <option value="Specialist">ልዩ ሀኪም ማማከር</option>
            </select>
          </div>
        </div>

        <div className="form-card">
          <h3>{currentText.dateTimeTitle || 'ቀን እና ሰዓት'}</h3>
          <div className="form-group">
            <label htmlFor="date">{currentText.dateLabel || 'የቀጠሮ ቀን'}:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeSlot">{currentText.timeLabel || 'የቀጠሮ ሰዓት'}:</label>
            <select id="timeSlot" name="timeSlot" value={formData.timeSlot} onChange={handleChange} required disabled={!formData.date || !formData.service}>
              <option value="">{currentText.selectTimePlaceholder || '-- ሰዓት ይምረጡ --'}</option>
              {/* Static options for now */}
              <option value="09:00 AM">09:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="02:00 PM">02:00 PM</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading || !formData.fullName || !formData.phone || !formData.service || !formData.date || !formData.timeSlot}>
          {loading ? <div className="spinner"></div> : (currentText.submitButton || 'ቀጠሮ አስገባ')}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;