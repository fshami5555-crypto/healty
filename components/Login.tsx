import React, { useState } from 'react';
// Fix: Corrected import path for types
import type { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { AppleIcon, AvocadoIcon, CarrotIcon } from './Icons';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+962');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPhone, setSignInPhone] = useState('');

  const { language, setLanguage, t } = useLanguage();
  const { users } = useApp();

  const totalSteps = 4; // Language, Name, Email, Phone

  const backgroundImages = [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop', // Step 0: Mixed Fruits
    'https://images.unsplash.com/photo-1582538162233-2eb34939a039?q=80&w=1965&auto=format&fit=crop', // Step 1: Leafy Greens
    'https://images.unsplash.com/photo-1444732353913-DB728f352222?q=80&w=1974&auto=format&fit=crop', // Step 2: Berries
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1974&auto=format&fit=crop'  // Step 3: Vegetables
  ];
  
    const countries = [
        { nameKey: 'countryJordan', dial_code: '+962' },
        { nameKey: 'countrySaudiArabia', dial_code: '+966' },
        { nameKey: 'countryUnitedArabEmirates', dial_code: '+971' },
        { nameKey: 'countryEgypt', dial_code: '+20' },
        { nameKey: 'countryUnitedStates', dial_code: '+1' },
        { nameKey: 'countryUnitedKingdom', dial_code: '+44' },
        { nameKey: 'countryQatar', dial_code: '+974' },
        { nameKey: 'countryKuwait', dial_code: '+965' },
        { nameKey: 'countryBahrain', dial_code: '+973' },
        { nameKey: 'countryOman', dial_code: '+968' },
    ];


  const handleLanguageSelect = (lang: 'en' | 'ar') => {
    if (isTransitioning) return;
    setLanguage(lang);
    handleNext();
  }
  
  const handleNext = () => {
    if (isTransitioning) return;
    
    if (step === 1 && !name.trim()) {
        setError('Please enter your name.');
        return;
    }
     if (step === 2 && !email.trim()) {
        setError('Please enter your email.');
        return;
    }

    setError(null);
    setIsTransitioning(true);
    setTimeout(() => {
        setStep(prev => prev + 1);
        setIsTransitioning(false);
    }, 300);
  }

  const handleBack = () => {
    if (isTransitioning || step === 0) return;
    setError(null);
    setIsTransitioning(true);
    setTimeout(() => {
        setStep(prev => prev - 1);
        setIsTransitioning(false);
    }, 300);
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
        setError('Please enter your phone number.');
        return;
    }
    if (name && email && phone) {
      const isAdmin = email.toLowerCase() === 'admin@calorina.com' && name === 'admin123';
      onLogin({ name, email, isAdmin, phone: `${countryCode}${phone}`, isNewUser: true });
    } else {
        setError('Please fill in all the details.');
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim() || !signInPhone.trim()) {
        setError(t.signInError);
        return;
    }
    const user = users.find(u => u.email.toLowerCase() === signInEmail.toLowerCase() && u.phone === signInPhone);
    if (user) {
      onLogin(user);
    } else {
      setError(t.signInError);
    }
  };
  
  const progress = ((step + 1) / totalSteps) * 100;
  
  const renderSignUpStep = () => {
    switch (step) {
        case 0:
            return (
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-white drop-shadow-md">{t.chooseLanguage}</h2>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => handleLanguageSelect('en')} className="p-6 border border-white/30 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-xl text-xl font-bold text-white hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 transform hover:scale-105 shadow-md">
                            English
                        </button>
                        <button onClick={() => handleLanguageSelect('ar')} className="p-6 border border-white/30 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-xl text-xl font-bold text-white hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 transform hover:scale-105 shadow-md">
                            العربية
                        </button>
                    </div>
                </div>
            );
        case 1:
             return (
                <div>
                    <label htmlFor="name" className="text-2xl font-semibold text-white drop-shadow-md">{t.whatsYourName}</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="mt-4 block w-full px-4 py-3 border border-white/30 bg-white/20 dark:bg-black/20 backdrop-blur-sm text-white placeholder:text-white/60 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                        placeholder={t.namePlaceholder}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            );
        case 2:
            return (
                <div>
                    <label htmlFor="email-address" className="text-2xl font-semibold text-white drop-shadow-md">{t.whatsYourEmail}</label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="mt-4 block w-full px-4 py-3 border border-white/30 bg-white/20 dark:bg-black/20 backdrop-blur-sm text-white placeholder:text-white/60 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                        placeholder={t.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            );
        case 3:
            return (
                <div>
                    <label htmlFor="phone" className="text-2xl font-semibold text-white drop-shadow-md">{t.whatsYourPhone}</label>
                    <div className="mt-4 flex gap-2">
                         <select
                            name="countryCode"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="block w-1/3 px-2 py-3 border border-white/30 bg-white/20 dark:bg-black/20 backdrop-blur-sm text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            {countries.map(c => <option key={c.dial_code} value={c.dial_code} className="bg-gray-700">{`${t[c.nameKey as keyof typeof t]} (${c.dial_code})`}</option>)}
                        </select>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            className="block w-2/3 px-4 py-3 border border-white/30 bg-white/20 dark:bg-black/20 backdrop-blur-sm text-white placeholder:text-white/60 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                            placeholder={t.phonePlaceholder}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>
            );
        default:
            return null;
    }
  }

  return (
    <div>
        <div className="fixed inset-0">
            {backgroundImages.map((img, index) => (
                <div
                    key={index}
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
                    style={{
                        backgroundImage: `url(${img})`,
                        opacity: (mode === 'signin' && index === 0) || (mode === 'signup' && step === index) ? 1 : 0,
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-lg rounded-2xl shadow-2xl bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 relative overflow-hidden animate-slideInUp">
                
                <div className="absolute top-4 ltr:right-4 rtl:left-4 z-20">
                    <button 
                        onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(null); }} 
                        className="text-xs text-white/80 hover:text-white bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
                    >
                        {mode === 'signup' ? t.alreadyHaveAccount : t.dontHaveAccount}
                    </button>
                </div>

                <div className="relative p-6 md:p-8 space-y-6">
                    <AppleIcon className="w-16 h-16 text-white/10 absolute -top-5 -left-5 transform rotate-[-30deg]" />
                    <CarrotIcon className="w-12 h-12 text-white/10 absolute top-10 -right-4 transform rotate-[20deg]" />
                    <AvocadoIcon className="w-20 h-20 text-white/10 absolute -bottom-8 -right-6 transform rotate-[10deg]" />

                    <div className="text-center z-10 relative">
                        <img 
                          src="https://i.ibb.co/9mK2RbhS/21.png" 
                          alt="Calorina Logo" 
                          className="w-24 h-24 mx-auto mb-2" 
                        />
                        {mode === 'signup' && <p className="text-white/90 drop-shadow-md">{t.loginIntro}</p>}
                    </div>
                    
                    {mode === 'signup' ? (
                      <>
                        <div className="w-full bg-white/20 rounded-full h-2.5 z-10 relative">
                            <div className="bg-white h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        
                        <form onSubmit={handleSignUp} className="z-10 relative">
                            <div className="overflow-hidden relative min-h-[150px]">
                                <div key={step} className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                                    {renderSignUpStep()}
                                    {error && <p className="text-red-300 bg-red-900/50 px-3 py-1 rounded-md text-sm mt-2">{error}</p>}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/20">
                                <button type="button" onClick={handleBack} disabled={step === 0 || isTransitioning} className="px-6 py-2 text-sm font-medium rounded-md text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {t.backButton}
                                </button>
                                
                                {step < totalSteps - 1 ? (
                                    <button type="button" onClick={handleNext} disabled={isTransitioning} className="px-8 py-3 font-semibold rounded-md text-primary bg-white hover:bg-gray-100 transition-colors">
                                    {t.nextButton}
                                    </button>
                                ) : (
                                    <button type="submit" className="px-8 py-3 font-semibold rounded-md text-primary bg-white hover:bg-gray-100 transition-colors">
                                    {t.getStarted}
                                    </button>
                                )}
                            </div>
                        </form>
                      </>
                    ) : (
                      <div className="space-y-6">
                        <div className="text-center z-10 relative">
                          <h2 className="text-2xl font-semibold text-white drop-shadow-md">{t.signInToYourAccount}</h2>
                        </div>
                        <form onSubmit={handleSignIn} className="z-10 relative space-y-4">
                            <div>
                                <label htmlFor="signin-email" className="sr-only">{t.emailPlaceholder}</label>
                                <input
                                    id="signin-email"
                                    type="email"
                                    value={signInEmail}
                                    onChange={(e) => setSignInEmail(e.target.value)}
                                    placeholder={t.emailPlaceholder}
                                    required
                                    className="w-full px-4 py-3 border border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder:text-white/60 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="signin-phone" className="sr-only">{t.phonePlaceholderWithCode}</label>
                                <input
                                    id="signin-phone"
                                    type="tel"
                                    value={signInPhone}
                                    onChange={(e) => setSignInPhone(e.target.value)}
                                    placeholder={t.phonePlaceholderWithCode}
                                    required
                                    className="w-full px-4 py-3 border border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder:text-white/60 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                                />
                            </div>
                            {error && <p className="text-red-300 bg-red-900/50 px-3 py-1 rounded-md text-sm">{error}</p>}
                            <button type="submit" className="w-full px-8 py-3 font-semibold rounded-md text-primary bg-white hover:bg-gray-100 transition-colors">
                                {t.signInButton}
                            </button>
                        </form>
                      </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;
