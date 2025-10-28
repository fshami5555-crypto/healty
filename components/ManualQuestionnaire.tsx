import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
// Fix: Corrected import path for types
import type { UserProfileData } from '../types';

interface ManualQuestionnaireProps {
  onSubmit: (data: UserProfileData) => void;
  existingData?: UserProfileData | null;
}

const ManualQuestionnaire: React.FC<ManualQuestionnaireProps> = ({ onSubmit, existingData }) => {
  const { t } = useLanguage();
  
  const initialData: UserProfileData = {
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    preferences: '',
    allergies: ''
  };

  const [formData, setFormData] = useState<UserProfileData>(existingData || initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const questions = useMemo(() => [
    { id: 'gender', label: t.genderLabel, type: 'radio', options: [{value: 'male', label: t.genderMale}, {value: 'female', label: t.genderFemale}], required: true },
    { id: 'age', label: t.ageLabel, type: 'number', placeholder: 'e.g., 25', required: true },
    { id: 'weight', label: t.weightLabel, type: 'number', placeholder: t.weightPlaceholder, required: true },
    { id: 'height', label: t.heightLabel, type: 'number', placeholder: t.heightPlaceholder, required: true },
    { id: 'activityLevel', label: t.activityLevelLabel, type: 'select', options: [
        { value: 'sedentary', label: t.activitySedentary },
        { value: 'light', label: t.activityLight },
        { value: 'moderate', label: t.activityModerate },
        { value: 'active', label: t.activityActive },
        { value: 'veryActive', label: t.activityVeryActive }
    ], required: true },
    { id: 'preferences', label: t.preferencesLabel, type: 'textarea', placeholder: t.preferencesPlaceholder, required: false },
    { id: 'allergies', label: t.allergiesLabel, type: 'textarea', placeholder: t.allergiesPlaceholder, required: false }
  ], [t]);
  
  const inputBaseClasses = "mt-4 block w-full px-4 py-3 border border-gray-300 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary text-lg";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(error) setError(null);
  };

  const handleStepChange = (nextStep: number) => {
    if (isTransitioning) return;

    if (nextStep > currentStep) {
        const currentQuestion = questions[currentStep];
        if (currentQuestion.required && !formData[currentQuestion.id as keyof UserProfileData]) {
            setError(`This field is required.`);
            return;
        }
    }
    
    setError(null);
    setIsTransitioning(true);
    setTimeout(() => {
        setCurrentStep(nextStep);
        setIsTransitioning(false);
    }, 300);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const progress = (currentStep / questions.length) * 100;
  const isSummaryStep = currentStep === questions.length;

  const renderInput = () => {
    if (isSummaryStep) return null;
    const q = questions[currentStep];
    const key = q.id as keyof UserProfileData;

    switch(q.type) {
        case 'number':
            return <input id={q.id} name={q.id} type="number" placeholder={q.placeholder} required={q.required} className={inputBaseClasses} value={formData[key]} onChange={handleChange} />;
        case 'radio':
            return <div className="mt-4 space-y-3">{q.options?.map(opt => <div key={opt.value}><label className={`flex items-center p-4 border dark:border-dark-border rounded-lg cursor-pointer hover:bg-white dark:hover:bg-dark-surface ${formData[key] === opt.value ? 'bg-white dark:bg-dark-surface ring-2 ring-primary' : 'bg-transparent'}`}><input type="radio" name={q.id} value={opt.value} checked={formData[key] === opt.value} onChange={handleChange} className="h-5 w-5 text-primary focus:ring-primary" /><span className="ltr:ml-3 rtl:mr-3 text-lg font-medium">{opt.label}</span></label></div>)}</div>;
        case 'select':
            return <select id={q.id} name={q.id} required={q.required} className={inputBaseClasses} value={formData[key]} onChange={handleChange}>{q.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>;
        case 'textarea':
             return <textarea id={q.id} name={q.id} rows={4} placeholder={q.placeholder} className={inputBaseClasses} value={formData[key]} onChange={handleChange}></textarea>;
        default:
            return null;
    }
  }
  
  const getDisplayValue = (key: keyof UserProfileData, value: string) => {
      if (key === 'activityLevel') {
          const option = questions.find(q => q.id === 'activityLevel')?.options?.find(o => o.value === value);
          return option?.label || value;
      }
      if (key === 'gender') {
          const option = questions.find(q => q.id === 'gender')?.options?.find(o => o.value === value);
          return option?.label || value;
      }
      return value || '-';
  }


  return (
    <div className="flex items-center justify-center min-h-[80vh] animate-fadeIn">
      <div className="w-full max-w-2xl p-6 md:p-8 space-y-6 bg-neutral-light/80 dark:bg-dark-surface/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-neutral-light dark:border-dark-border">
        <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-dark-primary">{isSummaryStep ? t.summaryTitle : t.questionnaireTitle}</h1>
            <p className="mt-2 text-secondary-dark dark:text-dark-text-secondary">{isSummaryStep ? t.summarySubtitle : t.questionnaireSubtitle}</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-dark-background rounded-full h-2.5">
            <div className="bg-primary dark:bg-dark-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="overflow-hidden relative min-h-[250px]">
            <div key={currentStep} className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {isSummaryStep ? (
                    <div className="space-y-4 text-text-dark dark:text-dark-text">
                        {Object.entries(formData).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-3 bg-white/50 dark:bg-dark-background/50 rounded-md">
                                <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span className="text-right">{getDisplayValue(key as keyof UserProfileData, value as string)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <label className="text-xl font-semibold text-text-dark dark:text-dark-text">{questions[currentStep].label}</label>
                        {renderInput()}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                )}
            </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t dark:border-dark-border">
          <button type="button" onClick={() => handleStepChange(currentStep - 1)} disabled={currentStep === 0 || isTransitioning} className="px-6 py-2 text-sm font-medium rounded-md text-text-dark dark:text-dark-text bg-gray-200 dark:bg-dark-border hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {t.backButton}
          </button>
          
          {isSummaryStep ? (
            <button type="button" onClick={handleSubmit} className="px-8 py-3 font-semibold rounded-md text-white dark:text-dark-background bg-primary dark:bg-dark-primary hover:bg-opacity-90 transition-colors">
              {t.submitButton}
            </button>
          ) : (
            <button type="button" onClick={() => handleStepChange(currentStep + 1)} disabled={isTransitioning} className="px-6 py-2 text-sm font-medium rounded-md text-white dark:text-dark-background bg-primary dark:bg-dark-primary hover:bg-opacity-90">
              {t.nextButton}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualQuestionnaire;
