// src/components/LanguageContext.js
import React, { createContext, useState, useEffect } from 'react';

// 1. የትርጉም መረጃዎችን በአንድ ቦታ ማዘጋጀት
const translations = {
  am: {
    // Landing Page
    welcomeMain: 'ሸጋ እንኳን ደህና መጡ',
    welcomeSub: 'Welcome to Shega',
    bookButtonLanding: 'ቀጠሮ ያስይዙ (Book Appointment)',
    langAm: 'አማርኛ',
    langEn: 'English',
    // Appointment Form
    backButton: 'ወደ ኋላ',
    adminButton: 'ወደ አስተዳዳሪ ገጽ',
    formTitle: '📅 ቀጠሮ ያስይዙ',
    clientInfoTitle: 'የደንበኛ መረጃ',
    clientNameLabel: 'ስም:',
    clientEmailLabel: 'ኢሜይል:',
    clientPhoneLabel: 'ስልክ ቁጥር:',
    serviceInfoTitle: 'አገልግሎት ይምረጡ',
    serviceTypeLabel: 'የአገልግሎት አይነት:',
    serviceTypes: {
     'type1': 'Signature Facial',
      'type2': 'Dermaplaning',
      'type3': 'Microneedling',
      'type4': 'Chemical peel',
      'type5': 'BB Glowing',
      'type6': 'Microderma Brasion',
      'type7': 'Nano Infusion',
    },
    
    dateLabel: 'ቀን:',
    timeLabel: 'ሰዓት:',
    dateTimeTitle: 'ቀን እና ሰዓት ይምረጡ',
    
    submitButton: 'ቀጠሮ አስይዝ',
    // Messages
    loadingMessage: 'ቀጠሮዎ እየተመዘገበ ነው...',
    successMessage: '✅ ቀጠሮዎ በተሳካ ሁኔታ ተመዝግቧል።',
    errorMessage: '❌ ቀጠሮውን ሲያስይዙ ስህተት ተፈጥሯል፦',
    // Admin Dashboard
    adminDashboardTitle: '📅 የአስተዳዳሪ ዳሽቦርድ',
    loadingAppointments: 'የቀጠሮ ዝርዝሮች በመጫን ላይ ናቸው...',
    errorLoadingAppointments: 'የቀጠሮ ዝርዝሮችን መጫን አልተቻለም። እባክዎ ገጹን እንደገና ይጫኑ።',
    noAppointments: 'ምንም የተያዘ ቀጠሮ የለም።',
    tableHeaderDate: 'ቀን',
    tableHeaderTime: 'ሰዓት',
    tableHeaderClient: 'ደንበኛ',
    tableHeaderPhone: 'ስልክ',
    tableHeaderService: 'አገልግሎት',
    tableHeaderPrice: 'ዋጋ',
    tableHeaderSpecialist: 'ስፔሻሊስት',
    // Manage Services Page
    manageServices: {
      title: 'አገልግሎቶችን ያስተዳድሩ',
      link: 'አገልግሎቶችን አስተዳድር',
      addNewButton: 'አዲስ አገልግሎት ጨምር',
      tableHeaderName: 'የአገልግሎት ስም',
      tableHeaderType: 'የአገልግሎት አይነት',
      tableHeaderPrice: 'ዋጋ',
      tableHeaderDuration: 'የቆይታ ጊዜ (ደቂቃ)',
      tableHeaderActions: 'ተግባራት',
      editButton: 'አስተካክል',
      deleteButton: 'ሰርዝ',
      deleteConfirm: 'ይህን አገልግሎት ለመሰረዝ እርግጠኛ ነዎት?',
      errorLoading: 'አገልግሎቶችን መጫን አልተቻለም።',
      errorDeleting: 'አገልግሎቱን በመሰረዝ ላይ ስህተት ተፈጥሯል።',
      minutes: 'ደቂቃ',
    },
    // Service Form
    serviceForm: {
      addTitle: 'አዲስ አገልግሎት ጨምር',
      editTitle: 'አገልግሎት አስተካክል',
      nameLabel: 'የአገልግሎት ስም:',
      typeLabel: 'የአገልግሎት አይነት:',
      priceLabel: 'ዋጋ (ብር):',
      durationLabel: 'የቆይታ ጊዜ (በደቂቃ):',
      addButton: 'አገልግሎት ጨምር',
      saveButton: 'ለውጦችን አስቀምጥ',
      createSuccess: '✅ አገልግሎቱ በተሳካ ሁኔታ ተጨምሯል።',
      updateSuccess: '✅ አገልግሎቱ በተሳካ ሁኔታ ተስተካክሏል።',
      createError: '❌ አገልግሎቱን ሲጨምሩ ስህተት ተፈጥሯል:',
      updateError: '❌ አገልግሎቱን ሲያስተካክሉ ስህተት ተፈጥሯል:',
      errorFetching: 'የአገልግሎቱን መረጃ ማምጣት አልተቻለም።',
    },
    priceUnit: 'ብር',
    // Admin Sidebar
    adminSidebar: {
      title: 'አስተዳዳሪ',
      dashboard: 'ዳሽቦርድ',
      actions: 'ተግባራት',
      reports: 'ሪፖርቶች',
      logout: 'ውጣ',
    },
    // Login Page
    loginTitle: 'የአስተዳዳሪ መግቢያ',
    loginEmailLabel: 'ኢሜይል',
    loginPasswordLabel: 'የይለፍ ቃል',
    loginButton: 'ግባ',
    loginError: 'ኢሜይል ወይም የይለፍ ቃል ትክክል አይደለም።',
    backButtonLogin: 'ወደ ኋላ',    
    // Change Password
    changePasswordAction: 'የይለፍ ቃል ቀይር',
    changePasswordTitle: 'የይለፍ ቃልዎን ይቀይሩ',
    currentPasswordLabel: 'የአሁኑ የይለፍ ቃል',
    newPasswordLabel: 'አዲስ የይለፍ ቃል',
    confirmNewPasswordLabel: 'አዲስ የይለፍ ቃል ያረጋግጡ',
    changePasswordButton: 'የይለፍ ቃል ቀይር',
    passwordChangeSuccessMessage: '✅ የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል።',
    passwordChangeErrorMessage: '❌ የይለፍ ቃል ሲቀየር ስህተት ተፈጥሯል:',
    passwordLengthRequirement: 'የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት።',
    passwordsMustMatch: 'የይለፍ ቃሎች ይዛመዳሉ።',
    // Admin Actions
    adminActionsTitle: 'የአስተዳዳሪ ተግባራት',
    adminActionsDescription: 'አገልግሎቶችን፣ ሪፖርቶችን እና ሌሎች ተግባራትን ከዚህ ያስተዳድሩ።',
    viewReports: 'ሪፖርቶችን ይመልከቱ',
    newPasswordMismatchError: 'አዲስ የይለፍ ቃሎች አይዛመዱም።',
    // Forgot Password
    forgotPasswordLink: 'የይለፍ ቃልዎን ረሱ?',
    requestResetTitle: 'የይለፍ ቃልዎን ዳግም ያስጀምሩ',
    requestResetInstruction: 'የይለፍ ቃልዎን እንደገና ለማስጀመር የኢሜይል አድራሻዎን ያስገቡ። የማስጀመሪያ ሊንክ እንልክልዎታለን።',
    sendResetLinkButton: 'የማስጀመሪያ ሊንክ ላክ',
    resetLinkSuccessMessage: '✅ የይለፍ ቃል ማስጀመሪያ ሊንክ ወደ ኢሜይልዎ ተልኳል።',
    resetLinkErrorMessage: '❌ ኢሜይሉን ማግኘት አልተቻለም።',
    // Reset Password
    resetPasswordTitle: 'አዲስ የይለፍ ቃል ያስገቡ',
    resetPasswordButton: 'የይለፍ ቃልን ዳግም አስጀምር',
    passwordResetSuccessMessage: '✅ የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል። አሁን መግባት ይችላሉ።',
    passwordResetErrorMessage: '❌ የይለፍ ቃልን ዳግም ማስጀመር አልተቻለም። ሊንኩ የተሳሳተ ወይም ጊዜው ያለፈበት ሊሆን ይችላል።',
  },
  en: {
    // Landing Page
    welcomeMain: 'Welcome to Shega',
    welcomeSub: 'ሸጋ እንኳን ደህና መጡ',
    bookButtonLanding: 'Book Appointment (ቀጠሮ ያስይዙ)',
    langAm: 'Amharic',
    langEn: 'English',
    // Appointment Form
    backButton: 'Back',
    adminButton: 'Go to Admin',
    formTitle: '📅 Book an Appointment',
    clientInfoTitle: 'Client Information',
    clientNameLabel: 'Name:',
    clientEmailLabel: 'Email:',
    clientPhoneLabel: 'Phone Number:',
    serviceInfoTitle: 'Service Selection',
    serviceTypeLabel: 'Select Service Type:',
    serviceLabel: 'Select Service:',
    dateTimeTitle: 'Select Date & Time',
    timeLabel: 'Time:',
    serviceTypes: {// Service types translation
      'type1': 'Signature Facial', 
      'type2': 'Dermaplaning',
      'type3': 'Microneedling',
      'type4': 'Chemical peel',
      'type5': 'BB Glowing',
      'type6': 'Microderma Brasion',
      'type7': 'Nano Infusion',
    },
    
    submitButton: 'Book Appointment',
    // Messages
    loadingMessage: 'Booking your appointment...',
    successMessage: '✅ Your appointment has been successfully booked.',
    errorMessage: '❌ An error occurred while booking:',
    // Admin Dashboard
    adminDashboardTitle: '📅 Admin Dashboard',
    loadingAppointments: 'Loading appointments...',
    errorLoadingAppointments: 'Could not load appointments. Please refresh the page.',
    noAppointments: 'No appointments found.',
    tableHeaderDate: 'Date',
    tableHeaderTime: 'Time',
    tableHeaderClient: 'Client',
    tableHeaderPhone: 'Phone',
    tableHeaderService: 'Service',
    tableHeaderPrice: 'Price',
    tableHeaderSpecialist: 'Specialist',
    // Manage Services Page
    manageServices: {
      title: 'Manage Services',
      link: 'Manage Services',
      addNewButton: 'Add New Service',
      tableHeaderName: 'Service Name',
      tableHeaderType: 'Service Type',
      tableHeaderPrice: 'Price',
      tableHeaderDuration: 'Duration (min)',
      tableHeaderActions: 'Actions',
      editButton: 'Edit',
      deleteButton: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this service?',
      errorLoading: 'Could not load services.',
      errorDeleting: 'Error deleting service.',
      minutes: 'min',
    },
    // Service Form
    serviceForm: {
      addTitle: 'Add New Service',
      editTitle: 'Edit Service',
      nameLabel: 'Service Name:',
      typeLabel: 'Service Type:',
      priceLabel: 'Price (ETB):',
      durationLabel: 'Duration (in minutes):',
      addButton: 'Add Service',
      saveButton: 'Save Changes',
      createSuccess: '✅ Service added successfully.',
      updateSuccess: '✅ Service updated successfully.',
      createError: '❌ Error adding service:',
      updateError: '❌ Error updating service:',
      errorFetching: 'Could not fetch service details.',
    },
    priceUnit: 'ETB',
    // Admin Sidebar
    adminSidebar: {
      title: 'Admin',
      dashboard: 'Dashboard',
      actions: 'Actions',
      reports: 'Reports',
      logout: 'Logout',
    },
    // Login Page
    loginTitle: 'Admin Login',
    loginEmailLabel: 'Email',
    loginPasswordLabel: 'Password',
    loginButton: 'Login',
    loginError: 'Invalid email or password.',
    backButtonLogin: 'Back',    
    // Change Password
    changePasswordAction: 'Change Password',
    changePasswordTitle: 'Change Your Password',
    currentPasswordLabel: 'Current Password',
    newPasswordLabel: 'New Password',
    confirmNewPasswordLabel: 'Confirm New Password',
    changePasswordButton: 'Change Password',
    passwordChangeSuccessMessage: '✅ Password changed successfully.',
    passwordChangeErrorMessage: '❌ Error changing password:',
    passwordLengthRequirement: 'Password must be at least 8 characters long.',
    passwordsMustMatch: 'Passwords match.',
    // Admin Actions
    adminActionsTitle: 'Admin Actions',
    adminActionsDescription: 'Manage your services, reports, and other actions from here.',
    viewReports: 'View Reports',
    newPasswordMismatchError: 'New passwords do not match.',
    // Forgot Password
    forgotPasswordLink: 'Forgot Password?',
    requestResetTitle: 'Reset Your Password',
    requestResetInstruction: 'Enter your email address to reset your password. We will send you a reset link.',
    sendResetLinkButton: 'Send Reset Link',
    resetLinkSuccessMessage: '✅ A password reset link has been sent to your email.',
    resetLinkErrorMessage: '❌ Could not find the email.',
    // Reset Password
    resetPasswordTitle: 'Set a New Password',
    resetPasswordButton: 'Reset Password',
    passwordResetSuccessMessage: '✅ Your password has been reset successfully. You can now log in.',
    passwordResetErrorMessage: '❌ Failed to reset password. The link may be invalid or expired.',
  },
   
};


// 2. ኮንቴክስት መፍጠር
export const LanguageContext = createContext();

// 3. Provider ኮምፖነንት መፍጠር
export const LanguageProvider = ({ children }) => {
  // 1. ቋንቋውን ከ localStorage ለማንበብ ወይም ወደ 'am' በነባሪነት ለማዘጋጀት
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'am';
  });

  // 2. የቋንቋ ምርጫው ሲቀየር በ localStorage ላይ ለማስቀመጥ
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // ቋንቋን ለመቀያየር የሚረዳ ተግባር
  const toggleLanguage = () => {
    setLanguage(prevLanguage => (prevLanguage === 'am' ? 'en' : 'am'));
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage, // አዲሱን ተግባር ለኮንቴክስቱ እናጋራዋለን
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};