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
      <style>{`
        .menu-toggle {
          display: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 10px;
          color: #ff69b4;
        }
        .mobile-lang-switch {
          display: none;
        }
        @media (max-width: 768px) {
          .landing-container {
            padding-top: 0;
          }
          .landing-header {
            flex-wrap: wrap;
            padding: 10px 20px;
            position: relative;
            align-items: center;
          }
          .header-right {
            display: none;
            display: flex;
            width: 100%;
            justify-content: center;
            margin-top: 5px;
          }
          .header-right .language-switcher {
            display: none;
          }
          .menu-toggle {
            display: block;
            margin-left: auto;
          }
          .main-nav {
            display: none;
            flex-direction: column;
            width: 100%;
            text-align: left;
            padding: 10px 0;
            background-color: #fff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            border-radius: 0 0 20px 20px;
            overflow: hidden;
          }
          .main-nav.nav-open {
            display: flex;
          }
          .main-nav a, .nav-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 25px;
            width: 100%;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            color: #333;
            font-weight: 600;
            transition: all 0.3s ease;
            opacity: 0;
            animation: fadeInRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          .main-nav a:hover, .nav-item:hover {
            background-color: rgba(255, 105, 180, 0.08);
            color: #ff69b4 !important;
            padding-left: 35px;
          }
          .main-nav a i, .nav-item > i {
            font-size: 1.1rem;
            width: 20px;
            text-align: center;
            color: #ff69b4;
          }
          .nav-link {
            color: #333 !important;
            font-weight: 600;
          }
          .nav-item.nav-dropdown {
            flex-wrap: wrap;
            cursor: pointer;
          }
          .nav-item.nav-dropdown > .nav-link {
            display: flex;
            justify-content: space-between;
            width: auto;
            flex: 1;
            align-items: center;
          }
          .nav-dropdown .dropdown-content {
            display: none;
            position: static;
            background: transparent;
            box-shadow: none;
            padding: 0;
            margin: 0;
            width: 100%;
            min-width: unset;
          }
          .nav-dropdown.mobile-dropdown-open .dropdown-content {
            display: block;
            animation: none;
          }
          .nav-dropdown .dropdown-content a {
            background-color: rgba(0, 0, 0, 0.04);
            padding-left: 50px !important;
            font-size: 0.9em;
            font-weight: 500;
            border-bottom: 1px solid rgba(0,0,0,0.02);
          }
          .nav-dropdown .dropdown-content a:last-child {
            border-bottom: none;
          }
          /* Disable desktop hover effect on mobile */
          .nav-dropdown:hover .dropdown-content {
            display: none;
          }
          .nav-dropdown.mobile-dropdown-open:hover .dropdown-content {
            display: block; /* Keep it open if clicked */
          }
          /* Chevron icon for expandable menu */
          .nav-item.nav-dropdown > span.nav-link::after {
            content: '\\f078'; /* FontAwesome chevron-down */
            font-family: 'Font Awesome 5 Free';
            font-weight: 900;
            transition: transform 0.3s ease;
            padding-left: 10px;
            font-size: 0.8em;
          }
          .nav-item.nav-dropdown.mobile-dropdown-open > span.nav-link::after {
            transform: rotate(180deg);
          }

          .services-grid, .testimonials-grid {
            display: grid;
            grid-template-columns: 1fr !important;
            justify-items: center;
          }
          .service-card, .testimonial-card {
            width: 100%;
            max-width: 400px;
          }
          .mobile-lang-switch {
            display: flex;
            justify-content: center;
            gap: 10px;
            padding: 20px 25px;
            opacity: 0;
            animation: fadeInRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          /* Staggered animation delays */
          .main-nav.nav-open > *:nth-child(1) { animation-delay: 0.1s; }
          .main-nav.nav-open > *:nth-child(2) { animation-delay: 0.15s; }
          .main-nav.nav-open > *:nth-child(3) { animation-delay: 0.2s; }
          .main-nav.nav-open > *:nth-child(4) { animation-delay: 0.25s; }
          .main-nav.nav-open > *:nth-child(5) { animation-delay: 0.3s; }
          .main-nav.nav-open > *:nth-child(6) { animation-delay: 0.35s; }
          }
          .mobile-lang-switch .lang-btn {
            color: #333;
            border: 1px solid #333;
          }
          .mobile-lang-switch .lang-btn.active {
            background-color: #ff69b4;
            color: #fff;
            border-color: #ff69b4;
          }
          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to { opacity: 1; transform: translateX(0); }
          }
        }
      `}</style>
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
          {currentText.servicesList && currentText.servicesList.map((service, index) => (
            <div key={index} className="service-card" style={{ minWidth: '250px' }}>
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <h4 className="service-card-title">{service.title}</h4>
              <p className="service-card-description">{service.description}</p>
            </div>
          ))}
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