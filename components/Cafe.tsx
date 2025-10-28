import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import DrinkCard from './DrinkCard';
// Fix: Corrected import path for types
import type { DrinkCategory } from '../types';
import { CoffeeCupIcon } from './Icons';
import Carousel from './Carousel';

const Cafe: React.FC = () => {
    const { customDrinks } = useApp();
    const { t } = useLanguage();

    const drinkCategories: DrinkCategory[] = ['Hot Drinks', 'Cold Drinks', 'Protein Shakes', 'Juices'];

    const [activeCategory, setActiveCategory] = useState<DrinkCategory | 'All'>('All');

    const cafeImages = [
        "https://images.unsplash.com/photo-1514432324607-a09d9b4a8675?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551030173-1a29ab150fa4?q=80&w=1965&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1951&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop",
    ];

    const filteredDrinks = useMemo(() => {
        return customDrinks.filter(drink => {
            return activeCategory === 'All' || drink.category === activeCategory;
        });
    }, [customDrinks, activeCategory]);
    
    const FilterButton: React.FC<{ label: string; onClick: () => void; isActive: boolean }> = ({ label, onClick, isActive }) => (
      <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
          isActive ? 'bg-primary dark:bg-dark-primary text-white dark:text-dark-background' : 'bg-white dark:bg-dark-surface text-text-dark dark:text-dark-text hover:bg-neutral-light dark:hover:bg-dark-border'
        }`}
      >
        {label}
      </button>
    );

    return (
        <div className="space-y-8">
            <Carousel images={cafeImages} />
            <div className="text-center animate-subtleFadeIn">
                <h1 className="text-4xl font-bold text-primary dark:text-dark-primary">{t.cafeTitle}</h1>
                <p className="mt-2 text-secondary-dark dark:text-dark-text-secondary">{t.cafeSubtitle}</p>
            </div>
            
            <div className="p-4 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm rounded-xl shadow-lg border border-neutral-light dark:border-dark-border space-y-4 animate-slideInUp">
              <div className="flex flex-wrap items-center gap-2">
                  <FilterButton label={t.allCategories} onClick={() => setActiveCategory('All')} isActive={activeCategory === 'All'} />
                  {drinkCategories.map(cat => (
                      <FilterButton key={cat} label={t[`category${cat.replace(/\s/g, '')}`]} onClick={() => setActiveCategory(cat)} isActive={activeCategory === cat} />
                  ))}
              </div>
            </div>

            <div>
                {filteredDrinks.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDrinks.map((drink, index) => <DrinkCard key={`${drink.name}-${index}`} drink={drink} />)}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-white dark:bg-dark-surface rounded-lg shadow-md">
                        <CoffeeCupIcon className="w-16 h-16 mx-auto text-neutral-light dark:text-dark-border" />
                        <h3 className="mt-4 text-xl font-semibold text-primary dark:text-dark-primary">{t.noDrinksInCafeTitle}</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">{t.noDrinksInCafeSubtext}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cafe;
