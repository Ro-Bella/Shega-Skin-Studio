// frontend/src/api/appointmentsApi.js
import apiClient from '../api'; // ማዕከላዊ የሆነውን apiClient እናስገባለን

// አዲስ ቀጠሮ ለማስያዝ
// የ apiClient መሰረታዊ URL '/api' ስለሆነ፣ እዚህ ላይ '/appointments' የሚለውን እንጨምራለን።
export const createNewAppointment = (appointmentData) => apiClient.post('/appointments', appointmentData);
export const updateAppointment = (id, updatedData) => apiClient.put(`/appointments/${id}`, updatedData);
export const deleteAppointment = (id) => apiClient.delete(`/appointments/${id}`);
export const getAllAppointments = () => apiClient.get('/appointments');

// ሁሉንም ቀጠሮዎች ለማምጣት (ለአድሚን ዳሽቦርድ)
export const fetchAppointments = () => apiClient.get('/appointments');