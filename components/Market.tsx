import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';
import { ShoppingCartIcon, FireIcon } from './Icons';
import type { CustomMeal } from '../types';

interface MarketProps {
    onOpenCart: () => void;
}

const MarketMealCard: React.FC<{ meal: CustomMeal }> = ({ meal }) => {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const { addNotification } = useNotification();

    const handleAddToCart = () => {
        addToCart(meal);
        addNotification({ type: 'success', message: t.cart.addedToCart });
    };

    return (
        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg overflow-hidden border border-neutral-light dark:border-dark-border hover:shadow-2xl transition-shadow duration-300 flex flex-col animate-slideInUp">
            <img className="w-full h-48 object-cover" src={meal.image} alt={meal.name} />
            <div className="p-5 flex flex-col flex-grow">
                <h4 className="text-xl font-bold text-text-dark dark:text-dark-text">{meal.name}</h4>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-2 flex-grow">{meal.description}</p>
                <div className="mt-4 flex justify-between items-center text-sm font-medium">
                    <div className="flex items-center text-secondary dark:text-dark-secondary">
                        <FireIcon className="w-5 h-5 text-red-500 ltr:mr-1 rtl:ml-1" />
                        <span>{meal.calories} kcal</span>
                    </div>
                    <span className="font-bold text-lg text-primary dark:text-dark-primary">{meal.price.toFixed(2)} JOD</span>
                </div>
                 <div className="mt-4 pt-4 border-t dark:border-dark-border">
                    <button 
                        onClick={handleAddToCart}
                        className="w-full text-sm font-semibold bg-accent dark:bg-dark-accent text-primary dark:text-dark-background py-2 px-4 rounded-lg hover:opacity-80 transition-opacity duration-200"
                    >
                        {t.cart.addToCart}
                    </button>
                </div>
            </div>
        </div>
    );
};


const Market: React.FC<MarketProps> = ({ onOpenCart }) => {
    const { t } = useLanguage();
    const { customMeals } = useApp();
    const { totalItems } = useCart();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center p-4 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm rounded-xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
                <h1 className="text-3xl font-bold text-primary dark:text-dark-primary">{t.market}</h1>
                <button onClick={onOpenCart} className="relative p-2 text-text-dark dark:text-dark-text hover:text-primary dark:hover:text-dark-primary transition-colors">
                    <ShoppingCartIcon className="w-8 h-8"/>
                    {totalItems > 0 && (
                        <span className="absolute top-0 right-0 block h-5 w-5 rounded-full ring-2 ring-white dark:ring-dark-surface bg-red-500 text-white text-xs font-bold">
                            {totalItems}
                        </span>
                    )}
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customMeals.map((meal) => <MarketMealCard key={meal.id} meal={meal} />)}
            </div>
        </div>
    );
};

export default Market;