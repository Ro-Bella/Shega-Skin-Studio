// frontend/src/components/AdminManagement.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import './AdminDashboard.css'; // Sharing styles
import API_BASE_URL from '../api/config';

const API_URL = `${API_BASE_URL}/api/admin`;

const AdminManagement = () => {
  const { language, translations } = useContext(LanguageContext);
  const currentText = translations[language];
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formMessage, setFormMessage] = useState(''); // For form success/error messages

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editingAdmin, setEditingAdmin] = useState(null); // To hold the admin being edited

  const getConfig = () => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    if (!adminInfo || !adminInfo.token) {
      navigate('/admin/login');
      return {};
    }
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminInfo.token}`,
      },
    };
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(API_URL, getConfig());
        setAdmins(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch admins.');
        if (err.response && err.response.status === 401) {
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [navigate]);

  // Cleanup effect to remove super admin access when leaving the page
  useEffect(() => {
    // This function is called when the component unmounts
    return () => {
      sessionStorage.removeItem('superAdminAccess');
    };
  }, []); // Empty dependency array means this runs only on mount and unmount

  // Automatically clear the form message after a few seconds
  useEffect(() => {
    if (formMessage) {
      const timer = setTimeout(() => {
        setFormMessage('');
      }, 4000); // Clear after 4 seconds

      return () => clearTimeout(timer); // Cleanup timer on component unmount or if message changes
    }
  }, [formMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(''); // Clear previous messages
    const adminData = { email, password: password || undefined };

    try {
      if (editingAdmin) {
        // Update admin
        const { data } = await axios.put(`${API_URL}/${editingAdmin._id}`, adminData, getConfig());
        setAdmins(admins.map(admin => admin._id === editingAdmin._id ? data.data : admin));
        setFormMessage(`✅ ${currentText.adminUpdated}`);
      } else {
        // Create new admin
        const { data } = await axios.post(API_URL, adminData, getConfig());
        setAdmins([...admins, data.data]);
        setFormMessage(`✅ ${currentText.adminCreated}`);
      }
      // Reset form
      setEmail('');
      setPassword('');
      setEditingAdmin(null);
    } catch (err) {
      // Provide more specific error feedback
      const message = err.response?.data?.message || err.message || currentText.submitFail || 'An error occurred.';
      setFormMessage(`❌ ${message}`);

      if (err.response && err.response.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setEmail(admin.email);
    setPassword(''); // Clear password for security
  };

  const handleDelete = async (id) => {
    if (window.confirm(currentText.deleteConfirm)) {
      setFormMessage(''); // Clear previous messages
      try {
        await axios.delete(`${API_URL}/${id}`, getConfig());
        setAdmins(admins.filter(admin => admin._id !== id));
        setFormMessage(`✅ ${currentText.adminDeleted}`);
      } catch (err) {
        // Provide more specific error feedback
        const message = err.response?.data?.message || err.message || currentText.adminDeleteError || 'Failed to delete admin.';
        setFormMessage(`❌ ${message}`);
        if (err.response && err.response.status === 401) {
          navigate('/admin/login');
        }
      }
    }
  };

  const cancelEdit = () => {
    setEditingAdmin(null);
    setEmail('');
    setPassword('');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    sessionStorage.removeItem('superAdminAccess'); // Clear super admin access on logout
    navigate('/admin/login');
  };

  if (loading) return <div>{currentText.loading}</div>;
  if (error) return <div className="dashboard-container error"><h2>{error}</h2></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Link to="/admin/dashboard" className="back-link"> &larr; {currentText.backButton}</Link>
        <h1 className="title-gradient">{currentText.adminManagement}</h1>
      </div>

      <form onSubmit={handleSubmit} className="appointment-form" style={{ maxWidth: '600px', margin: 'auto', marginBottom: '2rem' }}>
        <h3 style={{ color: 'black' }}>{editingAdmin ? currentText.editAdmin : currentText.addNewAdmin}</h3>
        {formMessage && (
          <p
            className={`form-message ${formMessage.includes('❌') ? 'error' : 'success'}`}>
            {formMessage}
          </p>
        )}
        <div className="appointment-form-group">
          <label htmlFor="email" style={{ color: 'black' }}>{currentText.email}:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="appointment-form-group">
          <label htmlFor="password" style={{ color: 'black' }}>{currentText.password}:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={editingAdmin ? currentText.passwordPlaceholder : ''} required={!editingAdmin} />
        </div>
        <div className="action-buttons">
          <button type="submit" className="btn-confirm">{editingAdmin ? currentText.update : currentText.submit}</button>
          {editingAdmin && <button type="button" onClick={cancelEdit} className="btn-cancel">{currentText.cancel}</button>}
        </div>
      </form>

      <h3 style={{ color: 'black' }}>{currentText.adminList}</h3>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>{currentText.email}</th>
            <th>{currentText.dateCreated}</th>
            <th>{currentText.actions}</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.email}</td>
              <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => handleEdit(admin)} className="btn-confirm">{currentText.editAdmin}</button>
                  <button onClick={() => handleDelete(admin._id)} className="btn-cancel">{currentText.delete}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="dashboard-actions" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to="/admin/services" className="dashboard-action-link">{currentText.serviceManagement || 'Manage Services'}</Link>
      </div>
    </div>
  );
};

export default AdminManagement;