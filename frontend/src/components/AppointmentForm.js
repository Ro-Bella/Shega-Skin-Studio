// AppointmentForm.jsx (Frontend)

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Link ኮምፖነንትን እናስገባለን
import axios from 'axios'; // axios import እናደርጋለን
import './AppointmentForm.css'; // Importing CSS for styling
import { LanguageContext } from './LanguageContext'; // For multi-language support (Assuming this file exists)
import API_BASE_URL from '../api/config'; // አዲሱን ኮንፊግ እናስገባለን

const APPOINTMENTS_API_URL = `${API_BASE_URL}/api/appointments`;
const SERVICES_API_URL = `${API_BASE_URL}/api/services`;

const AppointmentForm = () => {
  const { language, translations } = useContext(LanguageContext);
  const currentText = translations[language];

  // State for form data
  const [formData, setFormData] = useState({ 
    fullName: '', // ወደ 'fullName' ተቀይሯል
    phone: '',
    service: '',
    date: '', 
    timeSlot: '',
  });

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [phoneError, setPhoneError] = useState(''); // ለስልክ ቁጥር ስህተት state
  const [services, setServices] = useState([]); // አገልግሎቶችን ከ API ለማምጣት
  const [bookedSlots, setBookedSlots] = useState([]); // For holding booked time slots
  const [availableSlots, setAvailableSlots] = useState([]); // For holding available time slots

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // በየሰከንዱ አዘምን

    return () => {
      clearInterval(timer); // ኮምፖነንቱ ሲዘጋ ሰዓቱን ማቆም
    };
  }, []);

  // ኮምፖነንቱ ሲጫን አገልግሎቶችን ከባክኤንድ ለማምጣት
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(SERVICES_API_URL);
        setServices(response.data); // የመጡትን አገልግሎቶች state ላይ እናስቀምጣለን
      } catch (error) {
        console.error("አገልግሎቶችን ማምጣት አልተቻለም:", error);
        // ለተጠቃሚው ስህተት መኖሩን ማሳየትም ይቻላል
      }
    };

    fetchServices();
  }, []); // ባዶ dependency array ማለት አንድ ጊዜ ብቻ ይስራ ማለት ነው

    // Generate time slots from 9 AM to 5 PM every hour
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(time);
    }
    return slots;
  };

  // Fetch booked slots when date changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (formData.date) {
        try {
          // Assuming an endpoint to get booked slots for a specific date
          const response = await axios.get(`${APPOINTMENTS_API_URL}/booked-slots?date=${formData.date}`);
          setBookedSlots(response.data); // e.g., ['10:00', '14:00']
        } catch (error) {
          console.error("Failed to fetch booked slots:", error);
          setBookedSlots([]); // Reset on error
        }
      }
    };

    fetchBookedSlots();
    // Reset time slot when date changes
    setFormData(prev => ({ ...prev, timeSlot: '' }));
  }, [formData.date]);

  // Update available slots when booked slots change
  useEffect(() => {
    const allSlots = generateTimeSlots();
    const available = allSlots.filter(slot => !bookedSlots.includes(slot));
    setAvailableSlots(available);
  }, [bookedSlots]);
  
  // መልዕክቱ ከ 5 ሰከንድ በኋላ በራሱ እንዲጠፋ (Auto-clear message)
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000); // 5000 ሚሊሰከንድ = 5 ሰከንድ
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the date is changed, reset the time slot
    const isDateChange = name === 'date';

    setFormData({
      ...formData,
      [name]: value
    });

    // የስልክ ቁጥር validation
    if (name === 'phone') {
      // የኢትዮጵያ ስልክ ቁጥር ቅርጸት፡ በ +2519 ወይም በ 09 የሚጀምር እና 8 ቁጥሮች የሚከተሉት
      const phoneRegex = /^(\+2519\d{8}|09\d{8})$/;
      if (!value) {
        setPhoneError(currentText.phoneErrorRequired);
      } else if (!phoneRegex.test(value)) {
        setPhoneError(currentText.phoneErrorInvalid);
      } else {
        setPhoneError(''); // ስህተት ከሌለ መልዕክቱን እናጠፋለን
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ፎርሙ ከመላኩ በፊት ስህተት ካለ ማረጋገጥ
    if (phoneError || !formData.phone) {
      setMessage(`❌ ${currentText.submitError}`);
      return; // ስህተት ካለ ፎርሙ እንዳይላክ እናደርጋለን
    }
    setLoading(true);
    setMessage(currentText.sending); // "Sending..."
    try {
      // ዳታውን ወደ ባክኤንድ እንልካለን
      const response = await axios.post(APPOINTMENTS_API_URL, {
        name: formData.fullName, // 'fullName'ን ወደ 'name' እንቀይረዋለን
        phone: formData.phone,
        service: formData.service,
        date: formData.date,
        timeSlot: formData.timeSlot,
      });

      setMessage(`✅ ${currentText.submitSuccess}`); // ከባክኤንድ የመጣውን መልዕክት እናሳያለን
      // ፎርሙን ባዶ እናደርጋለን
      setFormData({
        fullName: '',
        phone: '',
        service: '',
        date: '',
        timeSlot: '',
      });
    } catch (error) {
      // ስህተት ከተፈጠረ
      let errorMessage = currentText.submitFail;
      if (error.response?.status === 409) {
        errorMessage = currentText.timeSlotTaken;
      }

      setMessage(`❌ ${errorMessage}`);
    } finally {
      setLoading(false); // `loading` ሁኔታን ወደ false እንመልሳለን
    }
  };

  return (
    <div className="appointment-form-container">
      <style>{`
        @media (max-width: 768px) {
          .appointment-form-container {
            padding: 1rem;
          }
          .form-page-header {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .form-header-left {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .back-link {
            align-self: flex-start;
            margin-bottom: 0.5rem;
          }
          .datetime-container {
            width: 100%;
            justify-content: center;
            margin-top: 0.5rem;
          }
          .appointment-form {
            padding: 1.5rem;
            width: 100%;
            box-sizing: border-box;
          }
          .appointment-form-submit {
            width: 100%;
          }
        }
      `}</style>
      <div className="form-page-header"> {/* New wrapper */}
        <div className="form-header-left">
          <Link to="/" className="back-link"> &larr; {currentText.backButton}</Link>
          <h2 className="title-gradient">{currentText.formTitle}</h2>
        </div>
        <div className="datetime-container">
          <div className="time-display">{currentDateTime.toLocaleTimeString(language === 'am' ? 'am-ET' : 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</div>
          <div className="date-display">{currentDateTime.toLocaleDateString(language === 'am' ? 'am-ET-u-ca-ethiopic' : 'en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</div>
        </div>
      </div>
      {message && (
        <p
          className={`form-message ${message.includes('❌') ? 'error' : 'success'}`}
          style={message.includes(currentText.timeSlotTaken) ? { color: 'black' } : {}}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-section">
          <h3>{currentText.clientInfoTitle}</h3>
          <div className="appointment-form-group">
            <label htmlFor="fullName">{currentText.clientNameLabel}:</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="appointment-form-group">
            <label htmlFor="phone">{currentText.clientPhoneLabel}:</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className={phoneError ? 'input-error' : ''} />
            {phoneError && <p className="error-message">{phoneError}</p>}
          </div>
        </div>

        <div className="form-section">
          <h3>{currentText.serviceInfoTitle}</h3>
          <div className="appointment-form-group">
            <label htmlFor="service">{currentText.serviceLabel}:</label>
            <select id="service" name="service" value={formData.service} onChange={handleChange} required>
              <option value="">{currentText.selectServicePlaceholder}</option>
              {currentText.servicesList && currentText.servicesList.map((service, index) => (
                <option key={index} value={service.title}>{service.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>{currentText.dateTimeTitle}</h3>
          <div className="appointment-form-group">
            <label htmlFor="date">{currentText.dateLabel}:</label>
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
          <div className="appointment-form-group">
            <label htmlFor="timeSlot">{currentText.timeLabel}:</label>
            <select
              id="timeSlot"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              required
              disabled={!formData.date || availableSlots.length === 0} // Disable if no date or no slots
            >
              <option value="">{formData.date ? (availableSlots.length > 0 ? currentText.selectTimePlaceholder || 'Select a time' : currentText.noSlotsAvailable || 'No slots available') : (currentText.selectDateFirst || 'Select a date first')}</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>{new Date(`1970-01-01T${slot}`).toLocaleTimeString(language === 'am' ? 'am-ET' : 'en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="appointment-form-submit" disabled={loading || phoneError || !formData.fullName || !formData.phone || !formData.service || !formData.date || !formData.timeSlot}>
          {loading ? <div className="spinner"></div> : currentText.submitButton}
        </button>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/admin/login">{currentText.adminLogin}</Link>
        </div>
      </form>
    </div>
  ); 
};

export default AppointmentForm;