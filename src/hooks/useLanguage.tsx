import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'ml';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'header.title': 'Kerala AgriSage',
    'header.subtitle': 'Digital Krishi Officer',
    'header.signin': 'Sign In',
    'header.getstarted': 'Get Started',
    
    // Hero Section
    'hero.badge': 'AI Powered Agriculture Assistant',
    'hero.title1': 'Your Pocket',
    'hero.title2': 'Krishi Bhavan',
    'hero.description': 'Get instant agricultural expert advice by asking in your language. Upload images to detect diseases and get risk predictions.',
    'hero.startfree': 'Start Free',
    'hero.watchdemo': 'Watch Demo',
    'hero.farmers': 'Happy Farmers',
    'hero.queries': 'Queries Resolved',
    'hero.accuracy': 'Accuracy',
    'hero.imagealt': 'Kerala Farmer',
    'hero.imagetitle': 'Your Farm\'s Success',
    'hero.imagedesc': 'Made Easy with Technology',
    
    // Features Section
    'features.title1': 'How',
    'features.title2': 'Kerala AgriSage',
    'features.title3': 'Helps',
    'features.subtitle': 'Providing instant assistance to farmers using modern AI technology',
    
    'features.chat.title': 'Ask in Your Language',
    'features.chat.desc': 'Ask all your agriculture-related questions in Malayalam through text or voice.',
    
    'features.image.title': 'Upload Images',
    'features.image.desc': 'Take a photo of your crop or leaves to identify diseases and get treatment recommendations.',
    
    'features.risk.title': 'Risk Prediction',
    'features.risk.desc': 'Get future risk assessments based on weather, soil, and crop information.',
    
    'features.expert.title': 'Reliable Advice',
    'features.expert.desc': 'Expert recommendations understanding Kerala\'s agricultural specifics.',
    
    'features.connect.title': 'Connect with Experts',
    'features.connect.desc': 'Discuss complex issues directly with agricultural officers that AI cannot resolve.',
    
    'features.instant.title': 'Instant Response',
    'features.instant.desc': '24/7 availability. No need to wait days, get answers within seconds.',
    
    // CTA Section
    'cta.title': 'Ready to Start?',
    'cta.description': 'Thousands of farmers in Kerala have already increased their yield using Kerala AgriSage.',
    'cta.button': 'Start Free',
    
    // Footer
    'footer.copyright': '© 2024 Kerala AgriSage. All rights reserved.',

    // Auth Page
    'auth.back': 'Go Back',
    'auth.signin.tab': 'Sign In',
    'auth.signup.tab': 'Sign Up',
    'auth.signin.title': 'Sign In',
    'auth.signin.desc': 'Access your account',
    'auth.signup.title': 'Sign Up',
    'auth.signup.desc': 'Create new account',
    'auth.email': 'Email',
    'auth.email.placeholder': 'Your email',
    'auth.password': 'Password',
    'auth.password.placeholder': 'Your password',
    'auth.signin.button': 'Sign In',
    'auth.signup.button': 'Sign Up',
    'auth.fullname': 'Full Name',
    'auth.fullname.placeholder': 'Your full name',
    'auth.phone': 'Phone Number',
    'auth.phone.placeholder': 'Your phone number',
    'auth.location': 'Location',
    'auth.location.placeholder': 'Your location',
    'auth.primarycrop': 'Primary Crop',
    'auth.primarycrop.placeholder': 'Rice, Banana, Pepper etc.',
    'auth.signin.error': 'Sign In Error',
    'auth.signup.error': 'Sign Up Error',
    'auth.signin.success': 'Sign In Successful!',
    'auth.signin.welcome': 'Welcome back!',
    'auth.signup.success': 'Sign Up Successful!',
    'auth.signup.verify': 'Check your email and verify your account.',
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.logout': 'Logout',
    'dashboard.chat': 'Expert Chat',
    'dashboard.imageAnalysis': 'Disease Detection',
    'dashboard.riskPrediction': 'Risk Assessment',
    'dashboard.dashboard': 'Dashboard',
    'dashboard.stats': 'Statistics',
    'dashboard.queries': 'Queries This Month',
    'dashboard.images': 'Images Analyzed',
    'dashboard.assessments': 'Risk Assessments',
    'dashboard.badges': 'Badges Earned',
    'dashboard.achievements': 'Achievements',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.weeklyProgress': 'Weekly Progress',
    'dashboard.learningResources': 'Learning Resources',
    'auth.error.general': 'Error',
    'auth.error.something': 'Something went wrong. Please try again.',
  },
  
  hi: {
    // Header
    'header.title': 'केरला AgriSage',
    'header.subtitle': 'डिजिटल कृषि अधिकारी',
    'header.signin': 'साइन इन',
    'header.getstarted': 'शुरू करें',
    
    // Hero Section
    'hero.badge': 'AI संचालित कृषि सहायक',
    'hero.title1': 'आपकी जेब में',
    'hero.title2': 'कृषि भवन',
    'hero.description': 'अपनी भाषा में पूछकर तुरंत कृषि विशेषज्ञ की सलाह लें। रोग की पहचान के लिए छवियां अपलोड करें और जोखिम पूर्वानुमान प्राप्त करें।',
    'hero.startfree': 'मुफ्त शुरू करें',
    'hero.watchdemo': 'डेमो देखें',
    'hero.farmers': 'खुश किसान',
    'hero.queries': 'हल किए गए प्रश्न',
    'hero.accuracy': 'सटीकता',
    'hero.imagealt': 'केरला किसान',
    'hero.imagetitle': 'आपकी खेती की सफलता',
    'hero.imagedesc': 'तकनीक से आसान बनाई गई',
    
    // Features Section
    'features.title1': 'कैसे',
    'features.title2': 'केरला AgriSage',
    'features.title3': 'मदद करता है',
    'features.subtitle': 'आधुनिक AI तकनीक का उपयोग करके किसानों को तत्काल सहायता प्रदान करना',
    
    'features.chat.title': 'अपनी भाषा में पूछें',
    'features.chat.desc': 'मलयाळम में टेक्स्ट या वॉयस के माध्यम से अपने सभी कृषि संबंधी प्रश्न पूछें।',
    
    'features.image.title': 'छवियां अपलोड करें',
    'features.image.desc': 'रोग की पहचान और उपचार की सिफारिशें पाने के लिए अपनी फसल या पत्तियों की फोटो लें।',
    
    'features.risk.title': 'जोखिम पूर्वानुमान',
    'features.risk.desc': 'मौसम, मिट्टी और फसल की जानकारी के आधार पर भविष्य के जोखिम का आकलन प्राप्त करें।',
    
    'features.expert.title': 'विश्वसनीय सलाह',
    'features.expert.desc': 'केरला की कृषि विशेषताओं को समझने वाली विशेषज्ञ सिफारिशें।',
    
    'features.connect.title': 'विशेषज्ञों से जुड़ें',
    'features.connect.desc': 'जटिल मुद्दों पर कृषि अधिकारियों के साथ सीधी चर्चा करें जिन्हें AI हल नहीं कर सकता।',
    
    'features.instant.title': 'तत्काल प्रतिक्रिया',
    'features.instant.desc': '24/7 उपलब्धता। दिनों तक इंतजार करने की जरूरत नहीं, सेकंडों में जवाब पाएं।',
    
    // CTA Section
    'cta.title': 'शुरू करने के लिए तैयार हैं?',
    'cta.description': 'केरला के हजारों किसानों ने पहले से ही केरला AgriSage का उपयोग करके अपनी उपज बढ़ाई है।',
    'cta.button': 'मुफ्त शुरू करें',
    
    // Footer
    'footer.copyright': '© 2024 केरला AgriSage। सभी अधिकार सुरक्षित।',

    // Auth Page
    'auth.back': 'वापस जाएं',
    'auth.signin.tab': 'साइन इन',
    'auth.signup.tab': 'साइन अप',
    'auth.signin.title': 'साइन इन करें',
    'auth.signin.desc': 'अपने खाते में प्रवेश करें',
    'auth.signup.title': 'साइन अप करें',
    'auth.signup.desc': 'नया खाता बनाएं',
    'auth.email': 'ईमेल',
    'auth.email.placeholder': 'आपका ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.password.placeholder': 'आपका पासवर्ड',
    'auth.signin.button': 'साइन इन करें',
    'auth.signup.button': 'साइन अप करें',
    'auth.fullname': 'पूरा नाम',
    'auth.fullname.placeholder': 'आपका पूरा नाम',
    'auth.phone': 'फोन नंबर',
    'auth.phone.placeholder': 'आपका फोन नंबर',
    'auth.location': 'स्थान',
    'auth.location.placeholder': 'आपका स्थान',
    'auth.primarycrop': 'मुख्य फसल',
    'auth.primarycrop.placeholder': 'चावल, केला, काली मिर्च आदि।',
    'auth.signin.error': 'साइन इन त्रुटि',
    'auth.signup.error': 'साइन अप त्रुटि',
    'auth.signin.success': 'साइन इन सफल!',
    'auth.signin.welcome': 'वापस स्वागत है!',
    'auth.signup.success': 'साइन अप सफल!',
    'auth.signup.verify': 'अपना ईमेल जांचें और खाता सत्यापित करें।',
    // Dashboard
    'dashboard.welcome': 'वापसी पर स्वागत',
    'dashboard.logout': 'लॉग आउट',
    'dashboard.chat': 'विशेषज्ञ चैट',
    'dashboard.imageAnalysis': 'रोग का पता लगाना',
    'dashboard.riskPrediction': 'जोखिम मूल्यांकन',
    'dashboard.dashboard': 'डैशबोर्ड',
    'dashboard.stats': 'सांख्यिकी',
    'dashboard.queries': 'इस महीने प्रश्न',
    'dashboard.images': 'छवियां विश्लेषित',
    'dashboard.assessments': 'जोखिम मूल्यांकन',
    'dashboard.badges': 'बैज अर्जित',
    'dashboard.achievements': 'उपलब्धियां',
    'dashboard.recentActivity': 'हाल की गतिविधि',
    'dashboard.weeklyProgress': 'साप्ताहिक प्रगति',
    'dashboard.learningResources': 'शिक्षा संसाधन',
    'auth.error.general': 'त्रुटि',
    'auth.error.something': 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
  },
  
  ml: {
    // Header
    'header.title': 'കേരള AgriSage',
    'header.subtitle': 'ഡിജിറ്റൽ കൃഷി ഓഫീസർ',
    'header.signin': 'സൈൻ ഇൻ',
    'header.getstarted': 'തുടങ്ങുക',
    
    // Hero Section
    'hero.badge': 'എ.ഐ പവർഡ് കൃഷി സഹായി',
    'hero.title1': 'നിങ്ങളുടെ പോക്കറ്റിലെ',
    'hero.title2': 'കൃഷി ഭവൻ',
    'hero.description': 'മലയാളത്തിൽ ചോദിച്ച് തൽക്ഷണം കൃഷി വിദഗ്ധന്റെ ഉപദേശം ലഭിക്കുക. ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്ത് രോഗം കണ്ടെത്തുക, റിസ്ക് പ്രവചനം നേടുക.',
    'hero.startfree': 'സൗജന്യമായി ആരംഭിക്കുക',
    'hero.watchdemo': 'ഡെമോ കാണുക',
    'hero.farmers': 'സന്തുഷ്ട കർഷകർ',
    'hero.queries': 'പരിഹരിച്ച ചോദ്യങ്ങൾ',
    'hero.accuracy': 'കൃത്യത',
    'hero.imagealt': 'Kerala Farmer',
    'hero.imagetitle': 'നിങ്ങളുടെ കൃഷിയുടെ വിജയം',
    'hero.imagedesc': 'സാങ്കേതികവിദ്യയിലൂടെ എളുപ്പമാക്കുന്നു',
    
    // Features Section
    'features.title1': 'എങ്ങനെ',
    'features.title2': 'കേരള AgriSage',
    'features.title3': 'സഹായിക്കുന്നു',
    'features.subtitle': 'ആധുനിക എ.ഐ സാങ്കേതികവിദ്യ ഉപയോഗിച്ച് കർഷകർക്ക് തൽക്ഷണ സഹായം നൽകുന്നു',
    
    'features.chat.title': 'മലയാളത്തിൽ ചോദിക്കുക',
    'features.chat.desc': 'ടെക്സ്റ്റ് അല്ലെങ്കിൽ വോയ്സിലൂടെ മലയാളത്തിൽ നിങ്ങളുടെ കൃഷി സംബന്ധിയായ എല്ലാ ചോദ്യങ്ങളും ചോദിക്കാം.',
    
    'features.image.title': 'ചിത്രം അപ്‌ലോഡ് ചെയ്യുക',
    'features.image.desc': 'വിളയുടെയോ ഇലയുടെയോ ഫോട്ടോ എടുത്ത് അപ്‌ലോഡ് ചെയ്താൽ രോഗം തിരിച്ചറിഞ്ഞ് ചികിത്സ നിർദ്ദേശങ്ങൾ ലഭിക്കും.',
    
    'features.risk.title': 'റിസ്ക് പ്രവചനം',
    'features.risk.desc': 'കാലാവസ്ഥ, മണ്ണ്, വിളയുടെ വിവരങ്ങൾ അടിസ്ഥാനമാക്കി ഭാവിയിലെ അപകടസാധ്യതകൾ മുൻകൂട്ടി അറിയുക.',
    
    'features.expert.title': 'വിശ്വസനീയ ഉപദേശം',
    'features.expert.desc': 'കേരളത്തിലെ കൃഷി പ്രത്യേകതകൾ മനസ്സിലാക്കി നൽകുന്ന വിദഗ്ധ ഉപദേശങ്ങൾ.',
    
    'features.connect.title': 'വിദഗ്ധരുമായി ബന്ധപ്പെടുക',
    'features.connect.desc': 'എ.ഐക്ക് പരിഹരിക്കാൻ കഴിയാത്ത സങ്കീർണ്ണ പ്രശ്നങ്ങൾ കൃഷി ഓഫീസറുമായി നേരിട്ട് ചർച്ച ചെയ്യാം.',
    
    'features.instant.title': 'തൽക്ഷണ പ്രതികരണം',
    'features.instant.desc': '24/7 ലഭ്യത. ദിവസങ്ങൾ കാത്തിരിക്കേണ്ട ആവശ്യമില്ല, സെക്കന്റുകൾക്കുള്ളിൽ ഉത്തരം ലഭിക്കും.',
    
    // CTA Section
    'cta.title': 'ആരംഭിക്കാൻ തയ്യാറാണോ?',
    'cta.description': 'കേരളത്തിലെ ആയിരക്കണക്കിന് കർഷകർ ഇതിനകം തന്നെ കേരള AgriSage ഉപയോഗിച്ച് തങ്ങളുടെ വിളവ് വർദ്ധിപ്പിച്ചിട്ടുണ്ട്.',
    'cta.button': 'സൗജന്യമായി ആരംഭിക്കുക',
    
    // Footer
    'footer.copyright': '© 2024 Kerala AgriSage. എല്ലാ അവകാശങ്ങളും സംരക്ഷിതം.',

    // Auth Page
    'auth.back': 'തിരികെ പോകുക',
    'auth.signin.tab': 'സൈൻ ഇൻ',
    'auth.signup.tab': 'സൈൻ അപ്പ്',
    'auth.signin.title': 'സൈൻ ഇൻ ചെയ്യുക',
    'auth.signin.desc': 'നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് പ്രവേശിക്കുക',
    'auth.signup.title': 'സൈൻ അപ്പ് ചെയ്യുക',
    'auth.signup.desc': 'പുതിയ അക്കൗണ്ട് സൃഷ്ടിക്കുക',
    'auth.email': 'ഇമെയിൽ',
    'auth.email.placeholder': 'നിങ്ങളുടെ ഇമെയിൽ',
    'auth.password': 'പാസ്‌വേഡ്',
    'auth.password.placeholder': 'നിങ്ങളുടെ പാസ്‌വേഡ്',
    'auth.signin.button': 'സൈൻ ഇൻ ചെയ്യുക',
    'auth.signup.button': 'സൈൻ അപ്പ് ചെയ്യുക',
    'auth.fullname': 'പൂർണ്ണ നാമം',
    'auth.fullname.placeholder': 'നിങ്ങളുടെ പൂർണ്ണ നാമം',
    'auth.phone': 'ഫോൺ നമ്പർ',
    'auth.phone.placeholder': 'നിങ്ങളുടെ ഫോൺ നമ്പർ',
    'auth.location': 'സ്ഥലം',
    'auth.location.placeholder': 'നിങ്ങളുടെ സ്ഥലം',
    'auth.primarycrop': 'പ്രധാന വിള',
    'auth.primarycrop.placeholder': 'നെല്ല്, വാഴ, കുരുമുളക് etc.',
    'auth.signin.error': 'സൈൻ ഇൻ പിശക്',
    'auth.signup.error': 'സൈൻ അപ്പ് പിശക്',
    'auth.signin.success': 'സൈൻ ഇൻ വിജയകരം!',
    'auth.signin.welcome': 'സ്വാഗതം തിരികെ!',
    'auth.signup.success': 'സൈൻ അപ്പ് വിജയകരം!',
    'auth.signup.verify': 'നിങ്ങളുടെ ഇമെയിൽ പരിശോധിച്ച് അക്കൗണ്ട് സ്ഥിരീകരിക്കുക.',
    // Dashboard
    'dashboard.welcome': 'തിരികെ സ്വാഗതം',
    'dashboard.logout': 'സൈൻ ഔട്ട്',
    'dashboard.chat': 'വിദഗ്ധ ചാറ്റ്',
    'dashboard.imageAnalysis': 'രോഗം കണ്ടെത്തൽ',
    'dashboard.riskPrediction': 'റിസ്ക് പ്രവചനം',
    'dashboard.dashboard': 'ഡാഷ്‌ബോർഡ്',
    'dashboard.stats': 'സ്ഥിതിവിവരക്കണക്കുകൾ',
    'dashboard.queries': 'ഈ മാസത്തെ ചോദ്യങ്ങൾ',
    'dashboard.images': 'വിശകലനം ചെയ്ത ചിത്രങ്ങൾ',
    'dashboard.assessments': 'റിസ്ക് അസസ്മെന്റുകൾ',
    'dashboard.badges': 'നേടിയ ബാഡ്ജുകൾ',
    'dashboard.achievements': 'നേട്ടങ്ങൾ',
    'dashboard.recentActivity': 'സമീപകാല പ്രവർത്തനം',
    'dashboard.weeklyProgress': 'പ്രതിവാര പുരോഗതി',
    'dashboard.learningResources': 'പഠന വിഭവങ്ങൾ',
    'auth.error.general': 'പിശക്',
    'auth.error.something': 'എന്തോ തെറ്റ് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};