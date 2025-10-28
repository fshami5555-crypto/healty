import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChartBarIcon, ChefIcon, PlateIcon } from './Icons';
import { useNotification } from '../contexts/NotificationContext';


const Subscription: React.FC = () => {
    const { t } = useLanguage();
    const { addNotification } = useNotification();

    const features = [
        {
            icon: <ChartBarIcon className="w-8 h-8 text-primary dark:text-dark-primary" />,
            title: t.feature1Title,
            description: t.feature1Desc,
        },
        {
            icon: <ChefIcon className="w-8 h-8 text-primary dark:text-dark-primary" />,
            title: t.feature2Title,
            description: t.feature2Desc,
        },
        {
            icon: <PlateIcon className="w-8 h-8 text-primary dark:text-dark-primary" />,
            title: t.feature3Title,
            description: t.feature3Desc,
        },
    ];

    const handleSubscribe = () => {
        addNotification({
            type: 'info',
            message: 'Subscription feature is currently a demo.',
        });
    }

    return (
        <div className="bg-white dark:bg-dark-surface p-6 md:p-8 rounded-2xl shadow-sm space-y-8 max-w-2xl mx-auto text-center animate-slideInUp">
            <div className="space-y-4">
                 <div className="relative inline-block w-32 h-24">
                   <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[110px] h-[50px] bg-[#E5E5E5] dark:bg-dark-border rounded-lg border-2 border-gray-300 dark:border-gray-500 shadow-inner"></div>
                   <div className="absolute bottom-[42px] left-1/2 -translate-x-1/2 w-[100px] h-[12px] bg-primary/90 dark:bg-dark-primary rounded-t-sm flex items-center justify-center text-white dark:text-dark-background text-[8px] font-bold shadow-sm">CALO</div>
                   <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[100px] h-[45px] bg-[#E5E5E5] dark:bg-dark-border rounded-lg border-2 border-gray-300 dark:border-gray-500 shadow-inner"></div>
                   <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-[90px] h-[12px] bg-primary/90 dark:bg-dark-primary rounded-t-sm flex items-center justify-center text-white dark:text-dark-background text-[8px] font-bold shadow-sm">CALO</div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-dark-text">{t.subscriptionTitle}</h1>
                <p className="text-md text-gray-600 dark:text-dark-text-secondary max-w-md mx-auto">{t.subscriptionSubtitle}</p>
            </div>

            <div className="space-y-6 pt-4 border-t dark:border-dark-border">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 text-start">
                        <div className="flex-shrink-0 bg-neutral-light dark:bg-dark-background p-3 rounded-full">
                            {feature.icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-text-dark dark:text-dark-text">{feature.title}</h3>
                            <p className="text-gray-500 dark:text-dark-text-secondary mt-1">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={handleSubscribe}
                className="w-full bg-primary dark:bg-dark-primary text-white dark:text-dark-background font-bold py-4 px-6 rounded-xl text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
            >
                {t.subscribeButton}
            </button>
        </div>
    );
};

export default Subscription;
