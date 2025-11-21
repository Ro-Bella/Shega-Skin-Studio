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
        © 2025 Shega Skin Studio. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;