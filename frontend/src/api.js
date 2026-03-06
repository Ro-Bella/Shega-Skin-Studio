import axios from 'axios';

// Check if the app is running in production (e.g., on Vercel)
const isProduction = import.meta.env.PROD;

// የ Backend API URL ከ Vercel Environment Variables እናነባለን።
// Vite 'import.meta.env' ይጠቀማል፣ 'process.env' አይደለም።
// በ Vercel ላይ የምናስገባው ተለዋዋጭ (variable) በ 'VITE_' መጀመር አለበት።
let API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  if (isProduction) {
    console.error("የBackend URL አልተገኘም! እባክዎ በ Vercel ላይ VITE_API_URL የሚል Environment Variable ያስገቡ።");
  } else {
    API_URL = 'http://localhost:5000'; // For local development
  }
}

// ለዲበጊንግ (ለማረጋገጥ)፡ Vercel ላይ የትኛውን URL እንደሚያነብ በኮንሶል ላይ እናያለን
console.log("Connecting to API at:", API_URL);

// ሁሉንም የኔትወርክ ጥያቄዎች (requests) በአንድ ቦታ ለማስተዳደር የ Axios instance እንፈጥራለን።
const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// እያንዳንዱ ጥያቄ ከመላኩ በፊት 'Authorization' ሄደርን ከነቶክኑ እንዲጨምር ያደርጋል።
// ይሄ በተለይ ጥበቃ ላላቸው (protected) ራውቶች በጣም አስፈላጊ ነው።
api.interceptors.request.use(config => {
  const adminInfo = localStorage.getItem('adminInfo')
    ? JSON.parse(localStorage.getItem('adminInfo'))
    : null;

  if (adminInfo && adminInfo.token) {
    config.headers.Authorization = `Bearer ${adminInfo.token}`;
  }
  return config;
});

export default api;