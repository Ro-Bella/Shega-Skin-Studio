// frontend/src/components/LanguageContext.js
import React, { createContext, useState, useEffect } from 'react';

// ኮንቴክስት ይፍጠሩ
export const LanguageContext = createContext();

// የኮንቴክስት አቅራቢ (Provider)
export const LanguageProvider = ({ children }) => {
  // ነባሪ ቋንቋ ከአካባቢ ማከማቻ (localStorage) ያንብቡ ወይም 'am' ያድርጉ
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'am';
  });

  // ቋንቋው ሲቀየር ወደ አካባቢ ማከማቻ ያስቀምጡ
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // የቋንቋ ትርጉሞች
  const translations = {
    en: {
      // General
      backButton: 'Back',
      adminLogin: 'Admin Login',
      loading: 'Loading...',
      langAm: 'Amharic',
      langEn: 'English',
      navHome: 'Home',
      navServices: 'Services',
      navAbout: 'About Us',
      navContact: 'Contact',
      navLocation: 'Location',

      // Landing Page
      welcomeMain: 'Welcome to Shega Skin Studio',
      welcomeSub: 'Your skin is our priority',
      studioDescription: 'Discover a place where beauty and wellness converge. At Shega Skin Studio, we offer personalized skincare treatments designed to rejuvenate your skin and soul. Our expert estheticians use state-of-the-art technology and premium products to deliver results you can see and feel.',
      bookButtonLanding: 'Book Appointment',
      testimonialsTitle: 'What Our Clients Say',
      testimonials: [
        { quote: "An amazing experience! My skin has never felt better. The staff is professional and caring. Highly recommended!", author: "Hana T." },
        { quote: "Shega Skin Studio is my go-to place for relaxation and skincare. The results are always fantastic.", author: "Lidya G." },
        { quote: "I was struggling with acne for years, but after a few sessions here, my skin is clear and glowing. Thank you, Shega!", author: "Samuel B." }
      ],
      // About Section
      aboutTitle: 'About Us',
      aboutContent: 'With over 5 years of extensive experience in the skincare industry, we proudly established Shega Skin Studio one year ago to bring our vision of holistic beauty to life. We are home to a team of hardworking and dedicated professionals who prioritize your skin\'s health above all else. We pride ourselves on maintaining a pristine, hygienic, and relaxing environment where you can unwind and rejuvenate while we care for your glow.',

      // Services Section
      servicesTitle: 'Our Premier Services',
      servicesList: [
          { icon: 'fas fa-spa', title: 'Signature Facials', description: 'Customized facials that target your specific skin concerns, leaving you with a radiant glow.' },
          { icon: 'fas fa-magic', title: 'Dermaplaning', description: 'Advanced treatments to reduce fine lines and wrinkles, restoring your skin\'s youthful vitality.' },
          { icon: 'fas fa-leaf', title: 'Microneedling', description: 'Stimulates collagen production to improve skin texture and reduce scars.' },
          { icon: 'fas fa-leaf', title: 'Chemical Peels', description: 'Exfoliates the skin to treat acne, scars, and discoloration.' },
          { icon: 'fas fa-leaf', title: 'Hidra Facial', description: 'Cleanses, extracts, and hydrates the skin using super serums.' },
          { icon: 'fas fa-leaf', title: 'BB Glowing', description: 'Semi-permanent foundation treatment for glowing, even-toned skin.' },
          { icon: 'fas fa-leaf', title: 'Microderma Brasion', description: 'Exfoliates dead skin cells to reveal a brighter complexion.' },
          { icon: 'fas fa-leaf', title: 'Nano Infusions', description: 'Non-invasive treatment to enhance product absorption and skin hydration.' },
          { icon: 'fas fa-leaf', title: 'Waxing Services', description: 'Professional hair removal for smooth and silky skin.' },
          

        
        
        ],
      // Appointment Form
      formTitle: 'Shega Appointment Form',
      clientInfoTitle: 'Client Information',
      clientNameLabel: 'Full Name',
      clientPhoneLabel: 'Phone Number',
      serviceInfoTitle: 'Service Information',
      serviceLabel: 'Service',
      selectServicePlaceholder: 'Select a Service',
      dateTimeTitle: 'Date and Time',
      dateLabel: 'Appointment Date',
      timeLabel: 'Appointment Time',
      selectTimePlaceholder: 'Select a time',
      noSlotsAvailable: 'No slots available for this date',
      selectDateFirst: 'Select a date first',
      submitButton: 'Submit Appointment',
      sending: 'Sending...',
      phoneErrorRequired: 'Phone number is required.',
      phoneErrorInvalid: 'Invalid format (e.g., 09... or +2519...)',
      submitError: 'Please enter the phone number correctly.',
      submitSuccess: 'Your appointment has been booked successfully!',
      submitFail: 'Failed to book appointment. Please try again.',
      timeSlotTaken: 'This time slot is already taken. Please choose another time.',

      // Admin Pages
      adminDashboardTitle: 'Shega Appointments Dashboard',
      searchPlaceholder: 'Search by name or phone...',
      dailySummaryTitle: 'Daily Appointment Summary',
      filterByStatus: 'Filter by Status:',
      all: 'All',
      pending: 'Pending',
      edit: 'Edit',
      editAppointmentTitle: 'Edit Appointment',
      confirmed: 'Confirmed',
      exportPDF: 'Export as PDF',
      cancelled: 'Cancelled',
      exportExcel: 'Export as Excel',
      serialNo: 'No.', // Added for serial number
      noAppointments: 'No appointments found.',
      // Table Headers
      name: 'Name',
      phone: 'Phone',
      service: 'Service',
      date: 'Date',
      time: 'Time',
      status: 'Status',
      actions: 'Actions',
      // Admin Management
      adminManagement: 'Admin Management',
      superAdminEmailLabel: 'Admin Email',
      superAdminPasswordLabel: 'Admin Password',
      addNewAdmin: 'Add New Admin',
      editAdmin: 'Edit',
      email: 'Email', // Kept for login
      password: 'Password', // Kept for login
      passwordPlaceholder: 'Fill only to change',
      submit: 'Submit', // Kept for login & other forms
      update: 'Update',
      cancel: 'Cancel', // Kept for other actions
      adminList: 'List of Admins',
      dateCreated: 'Date Created',
      deleteConfirm: 'Are you sure you want to delete this admin?',
      deleteConfirmAppointment: 'Are you sure you want to permanently delete this appointment? This action cannot be undone.',
      adminLoginSuccess: 'Logged in successfully!',
      // Service Management
      serviceManagement: 'Service Management',
      addNewService: 'Add New Service',
      serviceName: 'Service Name',
      serviceList: 'List of Services',
      deleteConfirmService: 'Are you sure you want to delete this service?',
      serviceDeleted: 'Service deleted successfully.',
      adminCreated: 'Admin created successfully!',
      adminUpdated: 'Admin updated successfully!',
      adminDeleted: 'Admin deleted successfully.',
      delete: 'Delete',
      superAdminAuthSuccess: 'Super admin authenticated successfully!',
      serverError: 'Server error. Please try again later.',
      superAdminAuthFailed: 'Authentication failed. You are not authorized.',
      invalidCredentials: 'Invalid email or password.',
    },
    am: {
      // General
      backButton: 'ወደ ኋላ',
      adminLogin: 'የአስተዳደር መግቢያ',
      loading: 'በመጫን ላይ...',
      langAm: 'አማርኛ',
      langEn: 'English',
      navHome: 'መነሻ',
      navServices: 'አገልግሎቶች',
      navAbout: 'ስለ እኛ',
      navContact: 'ያግኙን',
      navLocation: 'አድራሻ',

      // Landing Page
      welcomeMain: 'እንኳን ወደ ሸጋ የቆዳ ስቱዲዮ በደህና መጡ',
      welcomeSub: 'ቆዳዎ የእኛ ቅድሚያ ነው',
      studioDescription: 'ውበት እና ደህንነት የሚዋሃዱበትን ቦታ ያግኙ። በሸጋ የቆዳ ስቱዲዮ፣ ቆዳዎን እና ነፍስዎን ለማደስ የተዘጋጁ ግላዊ የቆዳ እንክብካቤ ህክምናዎችን እናቀርባለን። የእኛ ባለሙያዎች እርስዎ ሊያዩት እና ሊሰማዎት የሚችሉትን ውጤት ለማቅረብ ዘመናዊ ቴክኖሎጂን እና ከፍተኛ ጥራት ያላቸውን ምርቶች ይጠቀማሉ።',
      bookButtonLanding: 'ቀጠሮ ያስይዙ',
      testimonialsTitle: 'ደንበኞቻችን ስለ እኛ ምን ይላሉ',
      testimonials: [
        { quote: "አስደናቂ ተሞክሮ! ቆዳዬ እንደዚህ ተሰምቶት አያውቅም። ሰራተኞቹ ባለሙያ እና ተንከባካቢ ናቸው። በጣም እመክራለሁ!", author: "ሃና ፀ." },
        { quote: "ሸጋ ስኪን ስቱዲዮ ለመዝናናት እና ለቆዳ እንክብካቤ የምሄድበት ቦታ ነው። ውጤቱ ሁልጊዜ አስደናቂ ነው።", author: "ሊድያ ገ." },
        { quote: "ለዓመታት በብጉር እሰቃይ ነበር፣ ነገር ግን እዚህ ጥቂት ህክምናዎችን ከወሰድኩ በኋላ ቆዳዬ ንጹህ እና አንጸባራቂ ሆኗል። አመሰግናለሁ ሸጋ!", author: "ሳሙኤል በ." }
      ],
      // About Section
      aboutTitle: 'ስለ እኛ',
      aboutContent: 'በቆዳ እንክብካቤ ዘርፍ ከ5 ዓመታት በላይ ባካበትነው ጥልቅ ልምድ፣ የራሳችንን ራዕይ እውን ለማድረግ ሸጋ ስኪን ስቱዲዮን ከከፈትን እነሆ አንድ ዓመት ሞላን። ጉዞአችን በሙያ ፍቅር እና በክህሎት ላይ የተገነባ ነው። ለደህንነትዎ ቅድሚያ በሚሰጡ ታታሪ እና ፕሮፌሽናል ባለሙያዎቻችን እንኮራለን። ስቱዲዮአችን ንጽህናው የተጠበቀ እና ሰላማዊ መሆኑ፣ ለህክምናዎ አስተማማኝ እና ዘና የሚያደርግ ቦታ ያደርገዋል።',

      // Services Section
      servicesTitle: 'የእኛ ዋና አገልግሎቶች',
      servicesList: [
          { icon: 'fas fa-spa', title: 'ፊርማ የፊት ህክምናዎች', description: 'ለቆዳዎ አይነት እና ፍላጎት ተብለው የተዘጋጁ፣ ቆዳዎን የሚያንጸባርቁ የፊት ህክምናዎች።' },
          { icon: 'fas fa-magic', title: 'የእርጅና መከላከያ ህክምናዎች', description: 'የመሸብሸብ እና የእርጅና ምልክቶችን የሚቀንሱ፣ የቆዳዎን የወጣትነት ህይወት የሚመልሱ ዘመናዊ ህክምናዎች።' },
          { icon: 'fas fa-leaf', title: 'ማይክሮኒድሊንግ', description: 'የኮላጅን ምርትን በማነቃቃት የቆዳ ጥራትን የሚያሻሽል እና ጠባሳዎችን የሚቀንስ።' },
          { icon: 'fas fa-leaf', title: 'የኬሚካል ፒልስ', description: 'የሞቱ የቆዳ ሴሎችን በማንሳት ብጉርን፣ ጠባሳን እና የቆዳ ቀለምን የሚያስተካክል።' },
          { icon: 'fas fa-leaf', title: 'ቢቢ ግሎው', description: 'ለቆዳ ወጥ እና አንጸባራቂ ቀለም የሚሰጥ ከፊል-ቋሚ የመዋቢያ ህክምና።' },
          { icon: 'fas fa-leaf', title: 'ማይክሮደርማ ብራሽን', description: 'የሞቱ የቆዳ ሴሎችን በማንሳት ቆዳን የሚያበራ እና የሚያድስ።' },
          { icon: 'fas fa-leaf', title: 'ናኖ ኢንፊውዥን', description: 'የቆዳን እርጥበት እና የምርት መሳብ አቅምን የሚጨምር ህክምና።' },
          { icon: 'fas fa-leaf', title: 'ሃይድራ ፌሻል', description: 'ቆዳን የሚያጸዳ፣ የሚያርስ እና እርጥበት የሚሰጥ ዘመናዊ የፊት ህክምና።' },
          { icon: 'fas fa-star', title: 'አዲስ አገልግሎት', description: 'ስለ አዲሱ አገልግሎት መግለጫ እዚህ ይገባል።' },
          { icon: 'fas fa-leaf', title: 'የዋክስ አገልግሎት', description: 'ለስላሳ እና ጸጉር አልባ ቆዳ የሚሰጥ የባለሙያ የዋክስ አገልግሎት።' },
      ],
      // Appointment Form
      formTitle: 'ሸጋ ቀጠሮ ማስገቢያ ቅጽ',
      clientInfoTitle: 'የደንበኛ መረጃ',
      clientNameLabel: 'ሙሉ ስም',
      clientPhoneLabel: 'ስልክ ቁጥር',
      serviceInfoTitle: 'የአገልግሎት መረጃ',
      serviceLabel: 'አገልግሎት',
      selectServicePlaceholder: 'አገልግሎት ይምረጡ',
      dateTimeTitle: 'ቀን እና ሰዓት',
      dateLabel: 'የቀጠሮ ቀን',
      timeLabel: 'የቀጠሮ ሰዓት',
      selectTimePlaceholder: 'ሰዓት ይምረጡ',
      noSlotsAvailable: 'ለዚህ ቀን ምንም ክፍት ሰዓት የለም',
      selectDateFirst: 'መጀመሪያ ቀን ይምረጡ',
      submitButton: 'ቀጠሮ አስገባ',
      sending: 'እየላክን ነው...',
      phoneErrorRequired: 'ስልክ ቁጥር ማስገባት ግዴታ ነው።',
      phoneErrorInvalid: 'ትክክለኛ ቅርጸት አይደለም (ለምሳሌ: 09... ወይም +2519...)',
      submitError: 'እባክዎ የስልክ ቁጥሩን በትክክል ያስገቡ።',
      submitSuccess: 'ቀጠሮዎ በተሳካ ሁኔታ ተይዟል!',
      submitFail: 'ቀጠሮ ማስያዝ አልተቻለም። እባክዎ እንደገና ይሞክሩ።',
      timeSlotTaken: 'ይህ የቀጠሮ ሰዓት በሌላ ደንበኛ ተይዟል። እባክዎ ሌላ ሰዓት ይምረጡ።',

      // Admin Pages
      adminDashboardTitle: 'የሸጋ ቀጠሮዎች ዳሽቦርድ',
      searchPlaceholder: 'በስም ወይም በስልክ ይፈልጉ...',
      dailySummaryTitle: 'የየቀኑ የቀጠሮዎች ማጠቃለያ',
      filterByStatus: 'በሁኔታ ያጣሩ:',
      all: 'ሁሉም',
      pending: 'በመጠባበቅ ላይ',
      edit: 'አስተካክል',
      editAppointmentTitle: 'ቀጠሮ አስተካክል',
      confirmed: 'የተረጋገጠ',
      exportPDF: 'በፒዲኤፍ (PDF) አውርድ',
      cancelled: 'የተሰረዘ',
      exportExcel: 'በኤክሴል (Excel) አውርድ',
      serialNo: 'ቁጥር', // Added for serial number
      noAppointments: 'ምንም ቀጠሮዎች አልተገኙም።',
      // Table Headers
      name: 'ስም',
      phone: 'ስልክ',
      service: 'አገልግሎት',
      date: 'ቀን',
      time: 'ሰዓት',
      status: 'ሁኔታ',
      actions: 'ድርጊቶች',
      // Admin Management
      adminManagement: 'የአስተዳዳሪ አስተዳደር',
      superAdminEmailLabel: 'የአስተዳዳሪ ኢሜል',
      superAdminPasswordLabel: 'የአስተዳዳሪ የይለፍ ቃል',
      addNewAdmin: 'አዲስ አስተዳዳሪ ጨምር',
      editAdmin: 'አስተካክል',
      email: 'ኢሜል', // ለመግቢያ ስለሚያስፈልግ
      password: 'የይለፍ ቃል', // ለመግቢያ ስለሚያስፈልግ
      passwordPlaceholder: 'ለመቀየር ብቻ ይሙሉ',
      submit: 'አስገባ', // ለሌሎች ፎርሞችም ስለሚያስፈልግ
      update: 'አዘምን',
      cancel: 'ሰርዝ', // ለሌሎች ድርጊቶች ስለሚያስፈልግ
      adminList: 'የአስተዳዳሪዎች ዝርዝር',
      dateCreated: 'የተፈጠረበት ቀን',
      deleteConfirm: 'ይህን አስተዳዳሪ ለመሰረዝ እርግጠኛ ነዎት?',
      deleteConfirmAppointment: 'ይህን ቀጠሮ ከዳታቤዝ ላይ ሙሉ በሙሉ ለማጥፋት እርግጠኛ ነዎት? ይህን ድርጊት መመለስ አይቻልም።',
      delete: 'አጥፋ',
      // Service Management
      serviceManagement: 'የአገልግሎት አስተዳደር',
      addNewService: 'አዲስ አገልግሎት ጨምር',
      serviceName: 'የአገልግሎት ስም',
      serviceList: 'የአገልግሎቶች ዝርዝር',
      deleteConfirmService: 'ይህን አገልግሎት ለመሰረዝ እርግጠኛ ነዎት?',
      adminLoginSuccess: 'በተሳካ ሁኔታ ገብተዋል!',
      adminCreated: 'አዲስ አስተዳዳሪ በተሳካ ሁኔታ ተፈጥሯል!',
      adminUpdated: 'የአስተዳዳሪው መረጃ በተሳካ ሁኔታ ተቀይሯል!',
      adminDeleted: 'አስተዳዳሪው በተሳካ ሁኔታ ተሰርዟል።',
      superAdminAuthFailed: 'ማረጋገጥ አልተሳካም። ለመግባት አልተፈቀደልዎትም።',
      invalidCredentials: 'የተሳሳተ ኢሜል ወይም ፓስወርድ',
      superAdminAuthSuccess: 'የበላይ አስተዳዳሪ በተሳካ ሁኔታ ገብተዋል!',
      serverError: 'የሰርቨር ስህተት። እባክዎ ቆይተው ይሞክሩ።',
    },
  };

  // ኮንቴክስቱን ያቅርቡ
  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
