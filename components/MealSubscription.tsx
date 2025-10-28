import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
// Fix: Corrected import path for types
import type { MealSubscriptionData } from '../types';

interface MealSubscriptionProps {
  onSubmit: (data: MealSubscriptionData) => void;
}

const MealSubscription: React.FC<MealSubscriptionProps> = ({ onSubmit }) => {
  const { t } = useLanguage();
  
  const initialData: MealSubscriptionData = {
    planType: 'weekly',
    mealPackage: 'lunch',
    deliveryTime: 'morning',
    governorate: 'Amman',
    area: '',
    phone: ''
  };

  const [formData, setFormData] = useState<MealSubscriptionData>(initialData);
  const [currentStep, setCurrentStep] = useState(0);

  const jordanGovernorates: Record<string, string[]> = {
    Amman: ['Abdoun', 'Sweifieh', 'Jabal Amman', 'Dabouq'],
    Irbid: ['University Street', 'Hakama Street', 'City Center'],
    Zarqa: ['Zarqa al-Jadidah', 'Awajan', 'City Center'],
    Aqaba: ['City Center', 'Tala Bay', 'South Beach']
  };

  const prices = {
      weekly: { lunch: 25, lunch_dinner: 45, all: 60 },
      monthly: { lunch: 90, lunch_dinner: 170, all: 220 },
  };

  const steps = [
    { id: 'planType', label: t.planType },
    { id: 'mealPackage', label: t.mealPackage },
    { id: 'deliveryTime', label: t.deliveryTime },
    { id: 'deliveryLocation', label: t.deliveryLocation },
    { id: 'contactNumber', label: t.contactNumber },
    { id: 'summary', label: t.subscriptionSummary },
  ];

  const currentPrice = prices[formData.planType][formData.mealPackage];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    onSubmit(formData);
  };
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  const inputBaseClasses = "mt-2 block w-full px-4 py-3 border border-gray-300 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary text-lg";

  const renderStepContent = () => {
    switch(currentStep) {
        case 0: // Plan Type
            return (
                <div className="space-y-3">
                    {([ {id: 'weekly', label: t.planTypeWeekly}, {id: 'monthly', label: t.planTypeMonthly} ] as const).map(opt => (
                        <label key={opt.id} className={`flex items-center p-4 border dark:border-dark-border rounded-lg cursor-pointer ${formData.planType === opt.id ? 'bg-white dark:bg-dark-surface ring-2 ring-primary' : 'bg-transparent'}`}>
                            <input type="radio" name="planType" value={opt.id} checked={formData.planType === opt.id} onChange={handleChange} className="h-5 w-5 text-primary" />
                            <span className="ltr:ml-3 rtl:mr-3 text-lg font-medium">{opt.label}</span>
                        </label>
                    ))}
                </div>
            );
        case 1: // Meal Package
            return (
                 <div className="space-y-3">
                    {([ {id: 'lunch', label: t.packageLunch}, {id: 'lunch_dinner', label: t.packageLunchDinner}, {id: 'all', label: t.packageAll} ] as const).map(opt => (
                        <label key={opt.id} className={`flex items-center p-4 border dark:border-dark-border rounded-lg cursor-pointer ${formData.mealPackage === opt.id ? 'bg-white dark:bg-dark-surface ring-2 ring-primary' : 'bg-transparent'}`}>
                            <input type="radio" name="mealPackage" value={opt.id} checked={formData.mealPackage === opt.id} onChange={handleChange} className="h-5 w-5 text-primary" />
                            <span className="ltr:ml-3 rtl:mr-3 text-lg font-medium">{opt.label}</span>
                        </label>
                    ))}
                </div>
            );
        case 2: // Delivery Time
            return (
                <div className="space-y-3">
                    {([ {id: 'morning', label: t.deliveryTimeMorning}, {id: 'evening', label: t.deliveryTimeEvening} ] as const).map(opt => (
                        <label key={opt.id} className={`flex items-center p-4 border dark:border-dark-border rounded-lg cursor-pointer ${formData.deliveryTime === opt.id ? 'bg-white dark:bg-dark-surface ring-2 ring-primary' : 'bg-transparent'}`}>
                            <input type="radio" name="deliveryTime" value={opt.id} checked={formData.deliveryTime === opt.id} onChange={handleChange} className="h-5 w-5 text-primary" />
                            <span className="ltr:ml-3 rtl:mr-3 text-lg font-medium">{opt.label}</span>
                        </label>
                    ))}
                </div>
            );
        case 3: // Location
            return (
                <div className="space-y-4">
                    <div>
                        <label className="font-semibold">{t.governorate}</label>
                        <select name="governorate" value={formData.governorate} onChange={handleChange} className={inputBaseClasses}>
                            {Object.keys(jordanGovernorates).map(gov => <option key={gov} value={gov}>{gov}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="font-semibold">{t.area}</label>
                        <select name="area" value={formData.area} onChange={handleChange} className={inputBaseClasses}>
                            <option value="">Select area</option>
                            {jordanGovernorates[formData.governorate as keyof typeof jordanGovernorates]?.map(area => <option key={area} value={area}>{area}</option>)}
                        </select>
                    </div>
                </div>
            );
        case 4: // Phone
             return <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className={inputBaseClasses} placeholder={t.phonePlaceholder} />
        case 5: // Summary
            return (
                <div className="space-y-4 text-text-dark dark:text-dark-text">
                    <div className="p-4 bg-white/50 dark:bg-dark-background/50 rounded-lg">
                        <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-lg">{t.price}:</span>
                            <span className="text-3xl font-bold text-primary dark:text-dark-primary">{currentPrice} JOD</span>
                        </div>
                        <p className="text-xs text-right text-gray-500 dark:text-dark-text-secondary">/{formData.planType === 'weekly' ? 'week' : 'month'}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="font-semibold">{t.planType}:</span><span>{t[`planType${formData.planType.charAt(0).toUpperCase() + formData.planType.slice(1)}` as keyof typeof t]}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">{t.mealPackage}:</span><span>{t[`package${formData.mealPackage.charAt(0).toUpperCase() + formData.mealPackage.replace(/_([a-z])/g, g => g[1].toUpperCase()).slice(1)}` as keyof typeof t]}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">{t.deliveryTime}:</span><span>{t[`deliveryTime${formData.deliveryTime.charAt(0).toUpperCase() + formData.deliveryTime.slice(1)}` as keyof typeof t]}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">{t.deliveryLocation}:</span><span>{formData.governorate}, {formData.area}</span></div>
                    </div>
                     <p className="text-xs text-center text-gray-500 dark:text-dark-text-secondary pt-4 border-t dark:border-dark-border">{t.priceNote}</p>
                </div>
            );
        default: return null;
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 space-y-6 bg-neutral-light/80 dark:bg-dark-surface/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-neutral-light dark:border-dark-border animate-slideInUp">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary dark:text-dark-primary">{t.mealSubscriptionTitle}</h1>
        <p className="mt-2 text-secondary-dark dark:text-dark-text-secondary">{t.mealSubscriptionSubtitle}</p>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-dark-background rounded-full h-2.5">
          <div className="bg-primary dark:bg-dark-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="min-h-[250px]">
        <h2 className="text-xl font-semibold mb-4">{steps[currentStep].label}</h2>
        {renderStepContent()}
      </div>

      <div className="flex justify-between items-center pt-4 border-t dark:border-dark-border">
        <button onClick={handleBack} disabled={currentStep === 0} className="px-6 py-2 text-sm font-medium rounded-md text-text-dark dark:text-dark-text bg-gray-200 dark:bg-dark-border hover:bg-gray-300 disabled:opacity-50">
            {t.backButton}
        </button>
        {currentStep < steps.length - 1 ? (
            <button onClick={handleNext} className="px-6 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90">
                {t.nextButton}
            </button>
        ) : (
             <button onClick={handleSubmit} className="px-8 py-3 font-semibold rounded-md text-white bg-primary hover:bg-opacity-90">
                {t.confirmSubscription}
            </button>
        )}
      </div>
    </div>
  );
};

export default MealSubscription;
