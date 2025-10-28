import React from 'react';
// Fix: Corrected import path for types
import type { Exercise } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircleIcon } from './Icons';

interface WorkoutCardProps {
  exercise: Exercise;
  date: string;
  isCompleted: boolean;
  onToggleComplete: (date: string, type: 'exercise', name: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ exercise, date, isCompleted, onToggleComplete }) => {
  const { t } = useLanguage();

  const handleCompleteClick = () => {
    onToggleComplete(date, 'exercise', exercise.name);
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-5 border border-neutral-light dark:border-dark-border hover:shadow-xl transition-shadow duration-300 flex flex-col animate-slideInUp">
        <h4 className="text-xl font-bold text-text-dark dark:text-dark-text">{exercise.name}</h4>
        <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-2 flex-grow">{exercise.description}</p>
        <div className="mt-4 flex justify-between items-center text-sm font-medium text-secondary dark:text-dark-secondary border-t dark:border-dark-border pt-3">
          <div>
            <span className="font-semibold text-text-dark dark:text-dark-text">{t.sets}: </span>
            <span>{exercise.sets}</span>
          </div>
           <div>
            <span className="font-semibold text-text-dark dark:text-dark-text">{t.reps}: </span>
            <span>{exercise.reps}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t dark:border-dark-border">
          <button 
            onClick={handleCompleteClick}
            className={`w-full text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
              isCompleted 
                ? 'bg-primary/20 dark:bg-dark-primary/20 text-primary dark:text-dark-primary' 
                : 'bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-opacity-80'
            }`}
          >
            {isCompleted && <CheckCircleIcon className="w-5 h-5" />}
            {isCompleted ? t.completedButton : t.completeButton}
          </button>
        </div>
    </div>
  );
};

export default WorkoutCard;
