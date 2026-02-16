// Use NODE_ENV to reliably distinguish between production and development
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://shega-skin-studio.onrender.com' // Production URL for Render
  : 'http://localhost:5000'; // Development URL

export default API_BASE_URL;
