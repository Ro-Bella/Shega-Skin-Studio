// ይህ ፋይል የ Backend አድራሻን ይወስናል

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000' // በኮምፒውተርዎ ሲሰሩ
  : 'https://https://shega-skin-studio.onrender.com'; // Render ላይ ሲሆን (ይህንን በራስዎ Render URL ይቀይሩ)

export default API_BASE_URL;
