import React from 'react';
// Fix: Corrected import path for types
import type { CustomDrink } from '../types';
import { FireIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface DrinkCardProps {
  drink: CustomDrink;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  const { t } = useLanguage();

  const handleOrder = () => {
    alert(t.orderDrinkAlert.replace('{drinkName}', drink.name));
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg overflow-hidden border border-neutral-light dark:border-dark-border hover:shadow-2xl transition-shadow duration-300 flex flex-col animate-slideInUp">
      <img className="w-full h-40 object-cover" src={`https://picsum.photos/seed/${encodeURIComponent(drink.name)}/400/200`} alt={drink.name} />
      <div className="p-5 flex flex-col flex-grow">
        <h4 className="text-xl font-bold text-text-dark dark:text-dark-text">{drink.name}</h4>
        <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-2 flex-grow">{drink.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-sm font-medium text-secondary dark:text-dark-secondary">
            <FireIcon className="w-5 h-5 text-red-500 ltr:mr-1 rtl:ml-1" />
            <span>{drink.calories} kcal</span>
          </div>
          <button 
            onClick={handleOrder}
            className="text-sm font-semibold bg-accent dark:bg-dark-accent text-primary dark:text-dark-background py-2 px-4 rounded-lg hover:opacity-80 transition-opacity duration-200"
          >
            {t.orderNow}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrinkCard;
