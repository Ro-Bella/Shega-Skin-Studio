// frontend/src/api.js
import axios from 'axios';

// የ Backend API URL እዚህ ጋር እናስቀምጣለን።
// Vercel ላይ ስናደርገው VITE_API_URL የሚለውን variable ይጠቀማል።
// በራሳችን ኮምፒውተር ላይ ስናስኬደው ደግሞ http://localhost:5000 ይጠቀማል።
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ለዲበጊንግ (ለማረጋገጥ)፡ Vercel ላይ የትኛውን URL እንደሚያነብ በኮንሶል ላይ እናያለን
console.log("Connecting to API at:", API_URL);

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// እያንዳንዱ ጥያቄ ከመላኩ በፊት 'Authorization' ሄደርን ከነቶክኑ እንዲጨምር ያደርጋል
apiClient.interceptors.request.use(
  (config) => {
    const adminInfo = localStorage.getItem('adminInfo')
      ? JSON.parse(localStorage.getItem('adminInfo'))
      : null;

    if (adminInfo && adminInfo.token) {
      config.headers['Authorization'] = `Bearer ${adminInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;