import React, { useState } from 'react';
// Fix: Corrected import path for types
import type { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserIcon, SunIcon, MoonIcon } from './Icons';

interface SettingsProps {
    user: User | null;
    onUpdateUser: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const { addNotification } = useNotification();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user && name && email) {
            onUpdateUser({ ...user, name, email });
            addNotification({ type: 'success', message: t.profileUpdated });
        }
    };
    
    const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text rounded-md focus:outline-none focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary";

    return (
        <div className="max-w-4xl mx-auto space-y-8 text-text-dark dark:text-dark-text">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-primary dark:text-dark-primary">{t.settingsTitle}</h1>
                <p className="mt-2 text-secondary-dark dark:text-dark-text-secondary">{t.settingsSubtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Form */}
                <div className="md:col-span-2 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
                    <h2 className="text-2xl font-semibold text-primary dark:text-dark-primary mb-6">{t.updateProfile}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">{t.namePlaceholder}</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">{t.emailPlaceholder}</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <button type="submit" className="px-6 py-2 bg-primary dark:bg-dark-primary text-white dark:text-dark-background font-semibold rounded-md hover:bg-opacity-90 transition-colors">
                            {t.updateProfile}
                        </button>
                    </form>
                </div>

                {/* Other Settings */}
                <div className="space-y-8">
                    <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
                         <h2 className="text-2xl font-semibold text-primary dark:text-dark-primary mb-4">{t.theme}</h2>
                         <div className="flex items-center justify-between p-2 bg-neutral-light dark:bg-dark-background rounded-lg">
                            <span className="font-medium">{theme === 'light' ? t.lightMode : t.darkMode}</span>
                            <button onClick={toggleTheme} className="p-2 rounded-md bg-white dark:bg-dark-surface shadow-sm">
                                {theme === 'light' ? <MoonIcon className="w-5 h-5 text-primary" /> : <SunIcon className="w-5 h-5 text-dark-primary" />}
                            </button>
                         </div>
                    </div>
                    <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
                         <h2 className="text-2xl font-semibold text-primary dark:text-dark-primary mb-4">{t.languageSettings}</h2>
                         <div className="flex items-center justify-between p-2 bg-neutral-light dark:bg-dark-background rounded-lg space-x-2 rtl:space-x-reverse">
                            <button onClick={() => setLanguage('en')} className={`w-full py-2 rounded-md font-semibold transition-colors ${language === 'en' ? 'bg-primary text-white' : 'bg-white dark:bg-dark-surface'}`}>
                                English
                            </button>
                             <button onClick={() => setLanguage('ar')} className={`w-full py-2 rounded-md font-semibold transition-colors ${language === 'ar' ? 'bg-primary text-white' : 'bg-white dark:bg-dark-surface'}`}>
                                العربية
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
