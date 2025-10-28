import React from 'react';
// Fix: Corrected import path for types
import type { UserProfileData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { IdentificationIcon, PencilIcon } from './Icons';

interface UserProfileSummaryProps {
    data: UserProfileData;
    onEdit: () => void;
}

const UserProfileSummary: React.FC<UserProfileSummaryProps> = ({ data, onEdit }) => {
    const { t } = useLanguage();

    const activityLevels: { [key: string]: string } = {
        sedentary: t.activitySedentary,
        light: t.activityLight,
        moderate: t.activityModerate,
        active: t.activityActive,
        veryActive: t.activityVeryActive,
    };

    const displayItems = [
        { label: t.ageLabel.split('?')[0], value: data.age },
        { label: t.genderLabel.split('?')[0], value: data.gender === 'male' ? t.genderMale : t.genderFemale },
        { label: t.weightLabel.split('?')[0], value: `${data.weight} kg` },
        { label: t.heightLabel.split('?')[0], value: `${data.height} cm` },
        { label: t.activityLevelLabel.split('?')[0], value: activityLevels[data.activityLevel] },
    ];

    const longTextItems = [
        { label: t.preferencesLabel.split('?')[0], value: data.preferences },
        { label: t.allergiesLabel.split('?')[0], value: data.allergies },
    ];
    
    return (
        <div className="p-6 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <IdentificationIcon className="w-8 h-8 text-primary dark:text-dark-primary"/>
                    <h2 className="text-2xl font-bold text-primary dark:text-dark-primary">{t.healthProfileTitle}</h2>
                </div>
                <button 
                    onClick={onEdit}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary dark:text-dark-background bg-accent dark:bg-dark-accent rounded-lg hover:opacity-80 transition-opacity"
                >
                    <PencilIcon className="w-4 h-4" />
                    {t.editButton}
                </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 border-t dark:border-dark-border pt-4">
                {displayItems.map(item => (
                    <div key={item.label}>
                        <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{item.label}</p>
                        <p className="font-semibold text-lg text-text-dark dark:text-dark-text">{item.value}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 space-y-4">
                {longTextItems.map(item => (
                    item.value && (
                        <div key={item.label} className="border-t dark:border-dark-border pt-4">
                            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{item.label}</p>
                            <p className="text-text-dark dark:text-dark-text mt-1 whitespace-pre-wrap">{item.value}</p>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default UserProfileSummary;
