// frontend/src/api/appointmentsApi.js
import axios from 'axios';  // አክሲዮስ ለHTTP ጥያቄዎች
import API_BASE_URL from './config';

const API = axios.create({  // API ኢንስታንስ ፍጠር
    // Backend API የሚሰራበት አድራሻ
    baseURL: `${API_BASE_URL}/api`
});

// አዲስ ቀጠሮ ለማስያዝ
export const createNewAppointment = (appointmentData) => API.post('/', appointmentData);  // አዲስ ቀጠሮ መፍጠር
export const updateAppointment = (id, updatedData) => API.put(`/${id}`, updatedData);  // ቀጠሮ መስተካከል
export const deleteAppointment = (id) => API.delete(`/${id}`);  // ቀጠሮ ማጥፋት
export const getAllAppointments = () => API.get('/');  // ሁሉንም ቀጠሮዎች ማምጣት

// ሁሉንም ቀጠሮዎች ለማምጣት (ለአድሚን ዳሽቦርድ)
export const fetchAppointments = () => API.get('/');  // ሁሉንም ቀጠሮዎች መውሰድ