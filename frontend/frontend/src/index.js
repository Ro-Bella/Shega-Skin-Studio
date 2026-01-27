import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // App ኮምፖነንቱን እናስገባለን

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* አሁን App ኮምፖነንት ዋናው ነው */}
  </React.StrictMode>
);
