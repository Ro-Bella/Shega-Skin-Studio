// src/components/LandingPage.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate መጨመር
import './LandingPage.css';
import { LanguageContext } from './LanguageContext';

const LandingPage = () => {
  const { language, setLanguage, translations } = useContext(LanguageContext);
  const currentText = translations[language];
  const navigate = useNavigate(); // navigate ተግባርን ማዘጋጀት
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // በየሰከንዱ አዘምን

    return () => {
      clearInterval(timer); // ኮምፖነንቱ ሲዘጋ ሰዓቱን ማቆም
    };
  }, []);

  // ሰዓቱን እና ቀኑን እንደ ቋንቋው ማስተካከል
  const formattedTime = currentDateTime.toLocaleTimeString(language === 'am' ? 'am-ET' : 'en-US');
  const formattedDate = currentDateTime.toLocaleDateString(language === 'am' ? 'am-ET-u-ca-ethiopic' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    setIsContactDropdownOpen(false);
  };

  const handleContactToggle = (e) => {
    // Only apply click-to-toggle logic on mobile screen sizes
    if (window.innerWidth <= 768) {
      e.stopPropagation(); // Prevent other click handlers
      setIsContactDropdownOpen(prev => !prev);
    }
  };


  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="header-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Shega</div>
        
        <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>

        <nav className={`main-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          {/* These should be replaced with React Router's <Link> or <NavLink> for better SPA navigation */}
          <a href="/#" onClick={handleMenuClose}><i className="fas fa-home"></i>{currentText.navHome}</a>
          <a href="#services" onClick={handleMenuClose}><i className="fas fa-spa"></i>{currentText.navServices}</a>
          <a href="#about" onClick={handleMenuClose}><i className="fas fa-info-circle"></i>{currentText.navAbout}</a>
          <div className={`nav-item nav-dropdown ${isContactDropdownOpen ? 'mobile-dropdown-open' : ''}`} onClick={handleContactToggle}>
            <i className="fas fa-phone-alt"></i><span className="nav-link">{currentText.navContact}</span>
            <div className="dropdown-content">
              <a href="tel:+251911084237" onClick={handleMenuClose}><i className="fas fa-phone"></i> +251911084237</a>
              <a href="https://www.t.me/shega_skinstudio" target="_blank" rel="noopener noreferrer" onClick={handleMenuClose}><i className="fab fa-telegram-plane"></i> Telegram</a>
              <a href="mailto:info@shegastudio.com" onClick={handleMenuClose}><i className="fas fa-envelope"></i> Email</a>
            </div>
          </div>
          <a href="https://maps.app.goo.gl/sC7zhgZA2YiZVkgJ9?g_st=ipc" target="_blank" rel="noopener noreferrer" onClick={handleMenuClose}><i className="fas fa-map-marker-alt"></i>{currentText.navLocation}</a>
          <div className="mobile-lang-switch">
            <button onClick={() => { setLanguage('en'); handleMenuClose(); }} className={`lang-btn ${language === 'en' ? 'active' : ''}`}>{currentText.langEn}</button>
            <button onClick={() => { setLanguage('am'); handleMenuClose(); }} className={`lang-btn ${language === 'am' ? 'active' : ''}`}>{currentText.langAm}</button>
          </div>
        </nav>
        <div className="header-right">
          <div className="landing-datetime-container">
            <div className="landing-time-display">{formattedTime}</div>
            <div className="landing-date-display">{formattedDate}</div>
          </div>
          <div className="language-switcher">
            <button onClick={() => setLanguage('en')} className={`lang-btn ${language === 'en' ? 'active' : ''}`}>{currentText.langEn}</button>
            <button onClick={() => setLanguage('am')} className={`lang-btn ${language === 'am' ? 'active' : ''}`}>{currentText.langAm}</button>
          </div>
        </div>
      </header>
      <div className="landing-content">
        <h1 className="welcome-title-am">{currentText.welcomeMain}</h1>
        <h2 className="welcome-title-en">{currentText.welcomeSub}</h2>
        <p className="studio-description">{currentText.studioDescription}</p>
        <button onClick={() => navigate('/book')} className="cta-button"> 
          {currentText.bookButtonLanding}
        </button>
      </div>

      {/* Our Services Section */}
      <div id="services" className="services-section">
        <h3 className="services-title">{currentText.servicesTitle}</h3>
        <div className="services-grid">
          {currentText.servicesList && currentText.servicesList.map((service, index) => {
            const card = (
              <div className="service-card" style={{ minWidth: '250px', height: '100%' }}>
                <div className="service-icon">
                  <i className={service.icon}></i>
                </div>
                <h4 className="service-card-title">{service.title}</h4>
                <p className="service-card-description">{service.description}</p>
              </div>
            );

            return service.videoUrl ? (
              <a key={index} href={service.videoUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                {card}
              </a>
            ) : <div key={index}>{card}</div>;
          })}
        </div>
      </div>

      {/* About Us Section */}
      <div id="about" className="about-section">
        <h3 className="about-title">{currentText.aboutTitle}</h3>
        <div className="about-content">
          <p>{currentText.aboutContent}</p>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h3 className="testimonials-title">{currentText.testimonialsTitle}</h3>
        <div className="testimonials-grid">
          {currentText.testimonials && currentText.testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <p className="testimonial-author">- {testimonial.author}</p>
            </div>
          ))}
        </div>
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