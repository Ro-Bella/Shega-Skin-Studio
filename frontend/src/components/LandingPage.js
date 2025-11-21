// src/components/LandingPage.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate መጨመር
import './LandingPage.css';
import { LanguageContext } from './LanguageContext';

const LandingPage = () => {
  const { language, setLanguage, translations } = useContext(LanguageContext);
  const currentText = translations[language];
  const navigate = useNavigate(); // navigate ተግባርን ማዘጋጀት

  return (
    <div className="landing-container">
      <div className="landing-content">
      <div className="language-switcher">
          <button onClick={() => setLanguage('en')} className={`lang-btn ${language === 'en' ? 'active' : ''}`}>{currentText.langEn}</button>
          <button onClick={() => setLanguage('am')} className={`lang-btn ${language === 'am' ? 'active' : ''}`}>{currentText.langAm}</button>
        </div>
        <h1 className="welcome-title-am">{currentText.welcomeMain}</h1>
        <h2 className="welcome-title-en">{currentText.welcomeSub}</h2>
        <button onClick={() => navigate('/book')} className="cta-button"> 
          {currentText.bookButtonLanding}
        </button>
      </div>
      
        <footer className="landing-footer">
        <div className="footer-content">
          
          <div className="social-media-links">
            <a href="https://www.t.me/shega_skinstudio" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><i className="fab fa-telegram-plane"></i></a>
            <a href="https://www.instagram.com/shega_skinstudio?igsh=N2lxYmlsNDRmNHVk&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://www.tiktok.com/@shega.skin.studio?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" aria-label="Tiktok"><i className="fab fa-tiktok"></i></a>
            <a href="https://maps.app.goo.gl/sC7zhgZA2YiZVkgJ9?g_st=ipc" target="_blank" rel="noopener noreferrer" aria-label="Maps"><i className="fas fa-map-marker-alt"></i></a>
          </div>
          <span>© 2025 Shega Skin Studio. All rights reserved.</span>
        </div>
        
      </footer>
    </div>
  );
};

export default LandingPage;