import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Cog6ToothIcon, TruckIcon } from './Icons';
// Fix: Corrected import path for types
import type { MealSubscriptionData } from '../types';

interface SubscriptionSummaryCardProps {
    subscription: MealSubscriptionData;
    onManage: () => void;
}

const SubscriptionSummaryCard: React.FC<SubscriptionSummaryCardProps> = ({ subscription, onManage }) => {
    const { t } = useLanguage();

    const planDetails = {
        'weekly': t.planTypeWeekly,
        'monthly': t.planTypeMonthly,
    };

    const packageDetails = {
        'lunch': t.packageLunch,
        'lunch_dinner': t.packageLunchDinner,
        'all': t.packageAll,
    };

    const deliveryDetails = {
        'morning': t.deliveryTimeMorning,
        'evening': t.deliveryTimeEvening,
    }

    return (
        <div className="p-6 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3">
                        <TruckIcon className="w-8 h-8 text-primary dark:text-dark-primary" />
                        <h2 className="text-2xl font-bold text-primary dark:text-dark-primary">{t.subscriptionSummaryTitle}</h2>
                    </div>
                </div>
                <button 
                    onClick={onManage}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary dark:text-dark-background bg-accent dark:bg-dark-accent rounded-lg hover:opacity-80 transition-opacity"
                >
                    <Cog6ToothIcon className="w-4 h-4" />
                    {t.manageButton}
                </button>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-dark-border grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                    <p className="font-semibold text-gray-500 dark:text-dark-text-secondary">{t.plan}</p>
                    <p className="text-text-dark dark:text-dark-text">{planDetails[subscription.planType]}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-500 dark:text-dark-text-secondary">{t.meals}</p>
                    <p className="text-text-dark dark:text-dark-text">{packageDetails[subscription.mealPackage]}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-500 dark:text-dark-text-secondary">{t.delivery}</p>
                    <p className="text-text-dark dark:text-dark-text">{deliveryDetails[subscription.deliveryTime]}</p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionSummaryCard;
