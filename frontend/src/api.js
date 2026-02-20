import axios from 'axios';

// ይህ ፋይል የ API ጥያቄዎችን በአንድ ቦታ ለማስተዳደር ይረዳል።

// 1. የ Backend URL ከ Environment Variable ላይ ማንበብ
// በ Vercel ላይ 'REACT_APP_API_URL' የሚባል variable መፍጠር አለብዎት።
// ዋጋው (value) የ Render backend URL መሆን አለበት (ለምሳሌ፡ https://shega-app.onrender.com)
// በ Local ኮምፒውተርዎ ላይ ለመስራት በ frontend ፎልደር ውስጥ .env ፋይል ፈጥረው
// REACT_APP_API_URL=http://localhost:5000 ብለው ማስቀመጥ ይችላሉ።
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// 2. የ Token ማያያዣ (Interceptor)
// ይህ ኮድ እያንዳንዱ ጥያቄ ከመላኩ በፊት ቶክን (token) ካለ አያይዞ ይልካል።
// ይህም ለ private routes (እንደ admin dashboard) አስፈላጊ ነው።
api.interceptors.request.use((config) => {
  const adminInfo = localStorage.getItem('adminInfo')
    ? JSON.parse(localStorage.getItem('adminInfo'))
    : null;

  if (adminInfo && adminInfo.token) {
    config.headers.Authorization = `Bearer ${adminInfo.token}`;
  }
  return config;
});

export default api;