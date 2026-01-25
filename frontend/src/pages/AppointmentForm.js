// AppointmentForm.jsx (Frontend)

import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import './AppointmentForm.css'; // Importing CSS for styling
import { LanguageContext } from '../components/LanguageContext'; // For multi-language support (Assuming this file exists)
import API_BASE_URL from '../api/config';

const AppointmentForm = () => {
  // Using LanguageContext for translations
  const { language, translations } = useContext(LanguageContext);
  const currentText = translations[language];

  // State for form data
  const [formData, setFormData] = useState({
    fullName: '', // ከዚህ በፊት 'name' ነበር፣ ወደ 'fullName' ተቀይሯል
    phone: '',
    service: '',
    date: '',
    timeSlot: '',
  });
  
  // አዲሱ (ትክክለኛው)
  // import moved to top and stray axios.post removed
  

  // States for services, loading status, and messages
  const [services, setServices] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Generate time slots (09:00 - 17:00)
  const generateTimeSlots = useCallback(() => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  // Fetch services from backend on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/services`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  // Fetch available time slots when date or service changes
  useEffect(() => {
    if (formData.date) {
      const fetchBookedSlots = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/appointments/booked-slots?date=${formData.date}`);
          const bookedSlots = response.data;
          const allSlots = generateTimeSlots();
          const available = allSlots.filter(slot => !bookedSlots.includes(slot));
          setAvailableTimes(available);
        } catch (error) {
          console.error("Failed to fetch available times:", error);
          setAvailableTimes(generateTimeSlots()); // Fallback to all slots
        }
      };
      fetchBookedSlots();
    } else {
      setAvailableTimes([]);
    }
  }, [formData.date, generateTimeSlots]);

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

    try {
      await axios.post(`${API_BASE_URL}/api/appointments`, formData);
      setMessage(currentText.submitSuccess || `✅ ቀጠሮ በተሳካ ሁኔታ ተይዟል!`);
      // Reset form
      setFormData({ fullName: '', phone: '', service: '', date: '', timeSlot: '' });
      setAvailableTimes([]);
    } catch (error) {
      const messageKey = error.response?.data?.messageKey;
      const errorMessage = (messageKey && currentText[messageKey]) ? currentText[messageKey] : (error.response?.data?.message || error.message);
      setMessage(`${currentText.submitFail || '❌ ስህተት:'} ${errorMessage}`);
    } finally {
      setLoading(false);
    }
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
              {services.map((s) => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
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
            <select id="timeSlot" name="timeSlot" value={formData.timeSlot} onChange={handleChange} required disabled={!formData.date}>
              <option value="">{currentText.selectTimePlaceholder || '-- ሰዓት ይምረጡ --'}</option>
              {availableTimes.map(slot => (
                <option key={slot} value={slot}>
                  {new Date(`1970-01-01T${slot}`).toLocaleTimeString(language === 'am' ? 'am-ET' : 'en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </option>
              ))}
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