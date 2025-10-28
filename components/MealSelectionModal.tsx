import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
// Fix: Corrected import path for types
import type { MealItem } from '../types';

interface MealSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedMeals: MealItem[]) => void;
}

const MealSelectionModal: React.FC<MealSelectionModalProps> = ({ isOpen, onClose, onSave }) => {
    const { customMeals } = useApp();
    const { t } = useLanguage();
    const [selectedMeals, setSelectedMeals] = useState<MealItem[]>([]);

    const handleMealToggle = (meal: MealItem) => {
        setSelectedMeals(prev => 
            prev.some(m => m.name === meal.name)
                ? prev.filter(m => m.name !== meal.name)
                : [...prev, meal]
        );
    };

    const handleSave = () => {
        onSave(selectedMeals);
        setSelectedMeals([]); // Reset for next time
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-slideInUp">
                <div className="p-4 border-b dark:border-dark-border">
                    <h2 className="text-xl font-bold text-primary dark:text-dark-primary">{t.modalTitle}</h2>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{t.modalInstructions}</p>
                </div>
                <div className="p-4 overflow-y-auto">
                    <div className="space-y-2">
                        {customMeals.map(meal => (
                            <div key={meal.name} className="flex items-center p-2 border dark:border-dark-border rounded-md">
                                <input
                                    type="checkbox"
                                    id={`meal-${meal.name}`}
                                    checked={selectedMeals.some(m => m.name === meal.name)}
                                    onChange={() => handleMealToggle(meal)}
                                    className="h-4 w-4 rounded border-gray-300 dark:border-dark-border text-primary dark:text-dark-primary focus:ring-primary dark:focus:ring-dark-primary bg-transparent dark:bg-dark-surface"
                                />
                                <label htmlFor={`meal-${meal.name}`} className="ltr:ml-3 rtl:mr-3 block text-sm font-medium text-gray-700 dark:text-dark-text">
                                    {meal.name} <span className="text-xs text-gray-500 dark:text-dark-text-secondary">({t[`time${meal.time}`]})</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 border-t dark:border-dark-border flex justify-end gap-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-text bg-gray-100 dark:bg-dark-border rounded-md hover:bg-gray-200 dark:hover:bg-opacity-80">
                        {t.close}
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white dark:text-dark-background bg-primary dark:bg-dark-primary rounded-md hover:bg-opacity-90">
                        {t.saveSelection}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealSelectionModal;
