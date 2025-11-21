// src/components/AppointmentForm.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './AppointmentForm.css';
import { LanguageContext } from './LanguageContext';

// የባክ-ኢንዱ ቤዝ ዩአርኤል (URL)
const API_URL = 'http://localhost:5000/api';

const AppointmentForm = ({ onAppointmentBooked, onBackToHome }) => {
 // የቋንቋ ኮንቴክስትን መጠቀም
  const { language = 'am', translations = {} } = useContext(LanguageContext) || {};
  const currentText = translations[language] || {};

  // 1. ቅፅን ለመቆጣጠር የሚያገለግል State
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '+251',
    serviceType: 'type1', // የአገልግሎት አይነት መምረጫ state - 'Signature Facial' ነባሪ እንዲሆን 'type1' እናደርገዋለን
    service: '',
    // staff: '', // የሰራተኛ ምርጫ ስለማያስፈልግ ከ state እናስወግደዋለን
    date: '',
    startTime: '',
  });

  const [filteredServices, setFilteredServices] = useState([]);

  // 2. ከባክ-ኢንዱ የተጫኑ ዝርዝሮች (Lists)
  // (removed unused `services` state)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 4. የአገልግሎት አይነት ሲቀየር ተዛማጅ አገልግሎቶችን ከ API ለመጫን
  // የአገልግሎት አይነት ሲቀየር ተዛማጅ አገልግሎቶችን ከባክ-ኢንድ ያመጣል
  useEffect(() => {
    const fetchServicesForType = async () => {
      if (!formData.serviceType) {
        setFilteredServices([]);
        return;
      }
      try {
        // የአገልግሎት አይነት ሲቀየር፣ አዲስ ዝርዝር ስለሚመጣ የተመረጠውን አገልግሎት እናጸዳለን (reset)
        setFormData(prev => ({ ...prev, service: '', date: '', startTime: '' })); 
        setFilteredServices([]); // ዝርዝሩን እናጸዳለን
        const response = await axios.get(`${API_URL}/services/by-type/${formData.serviceType}`);
        setFilteredServices(response.data);
      } catch (error) {
        console.error("Error fetching services for type:", error);
        setFilteredServices([]);
      }
    };
    fetchServicesForType();
  }, [formData.serviceType]);

  // 5. የቅፅ ግብዓቶችን ለመቆጣጠር (Handle Input Changes)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(currentText?.loadingMessage || 'Loading...');
    setLoading(true);

    try {
      // የተሻሻለ የደንበኛ አያያዝ፡ ደንበኛው ካለ ማግኘት፣ ከሌለ መፍጠር (findOrCreate)
      let clientId;
      try {
        // በኢሜይል ደንበኛውን ለመፈለግ እንሞክራለን
        const existingClientRes = await axios.get(`${API_URL}/clients/by-email/${formData.clientEmail}`);
        clientId = existingClientRes.data._id;
      } catch (error) {
        // ደንበኛው ካልተገኘ (404 Not Found) አዲስ እንፈጥራለን
        if (error.response && error.response.status === 404) {
          const newClientRes = await axios.post(`${API_URL}/clients`, {
            name: formData.clientName,
            email: formData.clientEmail,
            phone: formData.clientPhone,
          });
          clientId = newClientRes.data._id;
        } else {
          throw error; // ሌላ ስህተት ከሆነ እናስተላልፋለን
        }
      }

      // የማጠናቀቂያ ሰዓት ማስላት
      // የተመረጠውን የአገልግሎት አይነት መሰረት በማድረግ ትክክለኛውን አገልግሎት መለየት
      const selectedService = filteredServices.find(s => s._id === formData.service);
      if (!selectedService) {
          throw new Error("Please select a valid service.");
      }
      
      const durationMinutes = selectedService.durationMinutes || 60;
      
      const startTime = new Date(`${formData.date}T${formData.startTime}`);
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

      const appointmentData = {
        client: clientId,
        service: selectedService._id, // ትክክለኛውን የአገልግሎት ID እንልካለን
        date: formData.date,
        startTime: formData.startTime,
        endTime: endTime.toTimeString().slice(0, 5),
      };

      const response = await axios.post(`${API_URL}/appointments`, appointmentData); // ሩቱን ወደ /api/appointments አስተካክለናል
      setMessage(currentText?.successMessage || 'Appointment booked.');
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '+251',
        service: '',
        date: '',
        startTime: '',
      });
      
      
      if (onAppointmentBooked) {
        onAppointmentBooked(response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setMessage(`${currentText?.errorMessage || 'Error:'} ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!currentText) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className="appointment-form-container">
      {/* "ወደ ኋላ" የሚለው ቁልፍ በግራ በኩል */}
      <button onClick={() => (onBackToHome ? onBackToHome() : window.history.back())} className="back-btn-login">
                {currentText.backButton} &larr;
            </button>
      {/* "አስተዳደር መግቢያ" የሚለው ቁልፍ በቀኝ በኩል */}
      <button onClick={() => window.location.href='/login'} className="admin-login-btn">
        {currentText.adminButton} &rarr;
      </button>
      <h2>{currentText.formTitle}</h2>
      {message && <p className={`form-message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-card">
          <h3>{currentText.clientInfoTitle}</h3>
          <div className="form-group">
            <label>{currentText.clientNameLabel}</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{currentText.clientEmailLabel}</label>
            <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{currentText.clientPhoneLabel}</label>
            <input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} />
          </div>
        </div>

        <div className="form-card">
          <h3>{currentText.serviceInfoTitle}</h3>
          {/* የአገልግሎት አይነት መምረጫ */}
          <div className="form-group">
            <label>{currentText.serviceTypeLabel}</label>
            <select name="serviceType" value={formData.serviceType} onChange={handleChange} required>
              <option value="">{currentText.selectServiceTypePlaceholder}</option>
              {Object.keys(currentText.serviceTypes || {}).map((typeKey) => (
                <option key={typeKey} value={typeKey}>{currentText.serviceTypes[typeKey]}</option>
              ))}
            </select>
          </div>
          {/* የአገልግሎት መምረጫ */}
          {filteredServices.length > 0 && (
            <div className="form-group">
              <label>{currentText.serviceLabel || 'አይነት እና ዋጋ'}</label>
              <select name="service" value={formData.service} onChange={handleChange} required>
                <option value="">{currentText.selectServicePlaceholder || '-- አገልግሎት ይምረጡ --'}</option>
                {filteredServices.map(service => (
                  <option key={service._id} value={service._id}>{`${service.name} (${service.price} ${currentText.priceUnit})`}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="form-card">
          <h3>{currentText.dateTimeTitle}</h3>
          <div className="form-group">
            <label>{currentText.dateLabel}</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="form-group">
            <label>{currentText.timeLabel}</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading || !formData.date || !formData.startTime}>
         {loading ? <div className="spinner"></div> : currentText.submitButton}
        </button>
      </form>
    </div>
  );
};


export default AppointmentForm;