// ይህ ፋይል የ Backend አድራሻን ይወስናል

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000' // በኮምፒውተርዎ ሲሰሩ
  : 'https://shega-skin-studio-backend.onrender.com'; // Render ላይ ሲሆን

export default API_BASE_URL;