// frontend/src/components/AdminDashboard.js
import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import API_BASE_URL from '../api/config';

const APPOINTMENTS_API_URL = `${API_BASE_URL}/api/appointments`;

const AdminDashboard = () => {
  const { language, translations } = useContext(LanguageContext);
  const currentText = translations[language];
  const navigate = useNavigate();

  // States for appointments
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Moved error state here
  const [searchTerm, setSearchTerm] = useState(''); // For search functionality
  const [statusFilter, setStatusFilter] = useState('All'); // For status filter

  // For Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  // የቀጠሮውን ሁኔታ ለመቀየር የሚያገለግል ተግባር
  const getConfig = () => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminInfo?.token}`,
      },
    };
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      // `status` 'Confirmed' ከሆነ 'confirm' endpoint, ካልሆነ 'cancel' endpoint እንጠቀማለን
      const endpoint = status === 'Confirmed' ? 'confirm' : 'cancel';
      const response = await axios.put(`${APPOINTMENTS_API_URL}/${id}/${endpoint}`, {}, getConfig());

      // የቀጠሮዎችን ዝርዝር በአዲሱ መረጃ እናዘምነዋለን
      setAppointments(currentAppointments =>
        currentAppointments.map(apt =>
          apt._id === id ? response.data.data : apt
        )
      );
    } catch (err) {
      // ለተጠቃሚው ስህተት መኖሩን ማሳየት (ከቋንቋ ፋይል)
      alert(`ስህተት፡ የቀጠሮውን ሁኔታ መቀየር አልተቻለም።`);
      console.error('Update status error:', err);
      if (err.response && err.response.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  // ቀጠሮን ከዳታቤዝ ለማጥፋት
  const handleDeleteAppointment = async (id) => {
    if (window.confirm(currentText.deleteConfirmAppointment || 'ይህን ቀጠሮ ከዳታቤዝ ላይ ሙሉ በሙሉ ለማጥፋት እርግጠኛ ነዎት? ይህን ድርጊት መመለስ አይቻልም።')) {
      try {
        await axios.delete(`${APPOINTMENTS_API_URL}/${id}`, getConfig());
        // የቀጠሮዎችን ዝርዝር እናዘምነዋለን
        setAppointments(currentAppointments =>
          currentAppointments.filter(apt => apt._id !== id)
        );
        alert('ቀጠሮው በተሳካ ሁኔታ ተሰርዟል።');
      } catch (err) { 
        alert(`ስህተት፡ ቀጠሮውን ማጥፋት አልተቻለም።`);
        if (err.response && err.response.status === 401) {
          navigate('/admin/login');
        }
      }
    }
  };

  // --- Edit Appointment Logic ---

  const handleEditClick = (appointment) => {
    setEditingAppointment(appointment);
    const originalDate = new Date(appointment.date).toISOString().split('T')[0];
    setNewDate(originalDate);
    setNewTimeSlot(appointment.timeSlot);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingAppointment(null);
    setNewDate('');
    setNewTimeSlot('');
    setAvailableSlots([]);
  };

  const generateTimeSlots = useCallback(() => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (newDate) {
        const allSlots = generateTimeSlots();
        try {
          const response = await axios.get(`${APPOINTMENTS_API_URL}/booked-slots?date=${newDate}`);
          const bookedSlotsForDate = response.data;
          
          const available = allSlots.filter(slot => {
            // Allow the original slot of the appointment being edited on its original date
            const originalDate = new Date(editingAppointment.date).toISOString().split('T')[0];
            if (editingAppointment && newDate === originalDate && slot === editingAppointment.timeSlot) {
              return true;
            }
            // Otherwise, the slot is available if it's not in the booked list
            return !bookedSlotsForDate.includes(slot);
          });
          setAvailableSlots(available);
        } catch (error) {
          console.error("Failed to fetch booked slots:", error);
          setAvailableSlots(allSlots); // On error, show all slots as a fallback
        }
      }
    };
    fetchBookedSlots();
  }, [newDate, editingAppointment, generateTimeSlots]);

  const handleUpdateAppointment = async () => {
    try {
      const response = await axios.put(`${APPOINTMENTS_API_URL}/${editingAppointment._id}`, { date: newDate, timeSlot: newTimeSlot }, getConfig());
      setAppointments(appointments.map(apt => apt._id === editingAppointment._id ? response.data.data : apt));
      handleCloseModal();
    } catch (error) {
      const messageKey = error.response?.data?.messageKey || 'updateError';
      const errorMessage = currentText[messageKey] || error.response?.data?.message || 'Failed to update appointment.';
      alert(errorMessage);
    }
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments
    .filter(apt => {
      if (statusFilter === 'All') return true;
      return apt.status === statusFilter;
    })
    .filter(apt =>
      (apt.name && apt.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (apt.phone && apt.phone.includes(searchTerm))
  );

  // Calculate daily appointment counts
  const dailyCounts = useMemo(() => {
    const counts = {};
    // Use the original appointments array to count all appointments regardless of filter
    appointments.forEach(apt => {
      // Normalize the date to avoid timezone issues and group by YYYY-MM-DD
      const date = new Date(apt.date).toISOString().split('T')[0];
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent date
  }, [appointments]);

  // ወደ PDF ለመቀየር
  const handleExportPDF = () => {
    const doc = new jsPDF();
    // This is a placeholder for a real font file.
    // In a real app, you would load a base64 encoded font file.
    // For now, we hope the browser can handle it, but for Amharic, it won't without a custom font.
    // The error was likely due to undefined text, let's ensure all text is valid.
    try {
        doc.setFont("NotoSansEthiopic", "normal"); // Attempt to set a font that supports Amharic
    } catch (e) {
        console.warn("Font not found, using default. Amharic text may not render correctly.", e);
        doc.setFont("helvetica", "normal");
    }

    doc.text(currentText.appointments || "Appointments", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [[currentText.name, currentText.phone, currentText.service, currentText.date, currentText.time, currentText.status]],
      body: filteredAppointments.map(apt => [
        apt.name || '',
        apt.phone || '',
        apt.service || '',
        new Date(apt.date).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US'),
        apt.timeSlot || '',
        currentText[apt.status.toLowerCase()] || apt.status || ''
      ]),
    });
    doc.save('shega-appointments.pdf');
  };

  // ወደ Excel ለመቀየር
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredAppointments.map(apt => ({
        [currentText.name]: apt.name,
        [currentText.phone]: apt.phone,
        [currentText.service]: apt.service,
        [currentText.date]: new Date(apt.date).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US'),
        [currentText.time]: apt.timeSlot,
        [currentText.status]: currentText[apt.status.toLowerCase()] || apt.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');

    // አምዶቹን ለማስተካከል
    const maxWidths = filteredAppointments.reduce((w, r) => {
      w[0] = Math.max(w[0], r.name.length);
      w[1] = Math.max(w[1], r.phone.length);
      return w;
    }, [10, 15, 20, 15, 10, 15]);
    worksheet['!cols'] = maxWidths.map(w => ({ wch: w }));

    XLSX.writeFile(workbook, 'shega-appointments.xlsx');
  };

  useEffect(() => {
    // Fetch appointments
    const fetchAppointments = async () => {
      try {
        // ወደፊት፡ ይህ ጥያቄ ሄደር ላይ ቶክን በመላክ ጥበቃ ሊደረግለት ይገባል
        const response = await axios.get(APPOINTMENTS_API_URL, getConfig());
        setAppointments(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('ቀጠሮዎችን ማምጣት አልተቻለም። እባክዎ ገጹን እንደገና ይጫኑ።');
        setLoading(false);
        if (err.response && err.response.status === 401) {
          navigate('/admin/login');
        }
      }
    };

    fetchAppointments();
  }, [navigate]);

  if (loading) {
    return <div className="dashboard-container"><h2>{currentText.loading}</h2></div>;
  }

  if (error) {
    return <div className="dashboard-container error"><h2>{error}</h2></div>;
  }
    return (


    <div className="dashboard-container">
      <div className="dashboard-header">
        <Link to="/" className="back-link"> &larr; {currentText.backButton}</Link>
        <h1 className="title-gradient">{currentText.adminDashboardTitle}</h1>
      </div>

      {/* Daily Summary Section */}
      <div className="daily-summary-section">
        <h3 className="section-title">{currentText.dailySummaryTitle}</h3>
        {dailyCounts.length > 0 ? (
          <div className="daily-summary-cards">
            {dailyCounts.map(({ date, count }) => (
              <div key={date} className="summary-card">
                <div className="summary-card-date">
                  {new Date(date).toLocaleDateString(language === 'am' ? 'am-ET-u-ca-ethiopic' : 'en-US', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="summary-card-count">{count}</div>
                <div className="summary-card-label">{currentText.appointments}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>{currentText.noAppointments}</p>
        )}
      </div>
      <div className="toolbar">
        <div className="search-container">
          <input
            type="text"
            placeholder={currentText.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <label htmlFor="status-filter">{currentText.filterByStatus}</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">{currentText.all}</option>
            <option value="Pending">{currentText.pending}</option>
            <option value="Confirmed">{currentText.confirmed}</option>
          </select>
        </div>
        <div className="export-buttons">
          <button onClick={handleExportPDF} className="btn-export-pdf">{currentText.exportPDF}</button>
          <button onClick={handleExportExcel} className="btn-export-excel">{currentText.exportExcel}</button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <p>{currentText.noAppointments}</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>{currentText.name}</th>
              <th>{currentText.phone}</th>
              <th>{currentText.service}</th>
              <th>{currentText.date}</th>
              <th>{currentText.time}</th>
              <th>{currentText.status}</th>
              <th>{currentText.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((apt) => (
              <tr key={apt._id}>
                <td>{apt.name}</td>
                <td>{apt.phone}</td>
                <td>{apt.service}</td>
                <td>{new Date(apt.date).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US')}</td>
                <td>{apt.timeSlot}</td>
                <td><span className={`status status-${apt.status.toLowerCase()}`}>{currentText[apt.status.toLowerCase()] || apt.status}</span></td>
                <td>
                  <div className="action-buttons">
                    {apt.status === 'Pending' && (
                      <button onClick={() => handleUpdateStatus(apt._id, 'Confirmed')} className="btn-confirm">
                        {currentText.confirmed}
                      </button>
                    )}
                    {apt.status !== 'Cancelled' && (
                      <button onClick={() => handleEditClick(apt)} className="btn-edit">
                        {currentText.edit}
                      </button>
                    )}
                    <button onClick={() => handleDeleteAppointment(apt._id)} className="btn-delete">
                      {currentText.delete || 'አጥፋ'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="dashboard-actions" style={{ textAlign: 'center', marginTop: '2rem' }}>
        {/* This button will navigate to the AdminManagement component */}
        <Link to="/admin/management-login" className="dashboard-action-link">{currentText.adminManagement || 'Manage Admins'}</Link>
      </div>

      {isEditModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>{currentText.editAppointmentTitle}</h2>
            <div className="appointment-form-group">
              <label htmlFor="edit-date">{currentText.dateLabel}</label>
              <input
                type="date"
                id="edit-date"
                value={newDate}
                onChange={(e) => {
                  setNewDate(e.target.value);
                  setNewTimeSlot(''); // Reset time when date changes
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="appointment-form-group">
              <label htmlFor="edit-time">{currentText.timeLabel}</label>
              <select
                id="edit-time"
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                disabled={!newDate}
              >
                <option value="">{currentText.selectTimePlaceholder}</option>
                {availableSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {new Date(`1970-01-01T${slot}`).toLocaleTimeString(language === 'am' ? 'am-ET' : 'en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={handleUpdateAppointment} className="btn-confirm">{currentText.update}</button>
              <button onClick={handleCloseModal} className="btn-cancel">{currentText.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;