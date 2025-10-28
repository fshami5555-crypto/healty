import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
// Fix: Corrected import path for types
import type { MealCategory, MealTime, CustomMeal, DrinkCategory, CustomDrink } from '../types';

const AdminDashboard: React.FC = () => {
    const { users, customMeals, addCustomMeal, setBackgroundImage, customDrinks, addCustomDrink } = useApp();
    const { t } = useLanguage();

    const [bgUrl, setBgUrl] = useState('');
    
    const [newMeal, setNewMeal] = useState({
        name: '',
        description: '',
        calories: '',
        category: 'Weight Loss' as MealCategory,
        time: 'Breakfast' as MealTime,
    });

    const [newDrink, setNewDrink] = useState({
        name: '',
        description: '',
        calories: '',
        category: 'Hot Drinks' as DrinkCategory,
    });

    const handleSettingsUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setBackgroundImage(bgUrl);
        alert('Background updated!');
    };

    const handleMealInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewMeal(prev => ({ ...prev, [name]: value }));
    };

    const handleAddMeal = (e: React.FormEvent) => {
        e.preventDefault();
        const meal: CustomMeal = {
            ...newMeal,
            calories: parseInt(newMeal.calories, 10) || 0,
        };
        if (meal.name && meal.description && meal.calories > 0) {
            addCustomMeal(meal);
            setNewMeal({
                name: '',
                description: '',
                calories: '',
                category: 'Weight Loss',
                time: 'Breakfast',
            });
        } else {
            alert('Please fill all meal fields correctly.');
        }
    };

    const handleDrinkInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewDrink(prev => ({ ...prev, [name]: value }));
    };

    const handleAddDrink = (e: React.FormEvent) => {
        e.preventDefault();
        const drink: CustomDrink = {
            ...newDrink,
            calories: parseInt(newDrink.calories, 10) || 0,
        };
        if (drink.name && drink.description && drink.calories > 0) {
            addCustomDrink(drink);
            setNewDrink({
                name: '',
                description: '',
                calories: '',
                category: 'Hot Drinks',
            });
        } else {
            alert('Please fill all drink fields correctly.');
        }
    };
    
    const mealCategories: MealCategory[] = ['Weight Loss', 'Muscle Gain', 'Healthy Lifestyle', 'Bodybuilding', 'Fitness'];
    const mealTimes: MealTime[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    const drinkCategories: DrinkCategory[] = ['Hot Drinks', 'Cold Drinks', 'Protein Shakes', 'Juices'];

    const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text rounded-md focus:outline-none focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary";
    const labelClasses = "block text-sm font-medium mb-1";


    return (
        <div className="space-y-8 text-text-dark dark:text-dark-text">
            <h1 className="text-4xl font-bold text-primary dark:text-dark-primary text-center">{t.adminTitle}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Management */}
                <div className="lg:col-span-1 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
                    <h2 className="text-2xl font-semibold text-primary dark:text-dark-primary mb-4">{t.userManagement}</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-light dark:bg-dark-background">
                                <tr>
                                    <th className="p-3">{t.nameHeader}</th>
                                    <th className="p-3">{t.emailHeader}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.email} className="border-b dark:border-dark-border">
                                        <td className="p-3">{user.name}</td>
                                        <td className="p-3">{user.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Settings & Management Column */}
                <div className="lg:col-span-2 space-y-8">
                     {/* App Settings */}
                    <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
                        <h2 className="text-2xl font-semibold text-primary dark:text-dark-primary mb-4">{t.appSettings}</h2>
                        <form onSubmit={handleSettingsUpdate} className="space-y-4">
                            <div>
                                <label htmlFor="bg-url" className={labelClasses}>{t.backgroundImageUrl}</label>
                                <input
                                    type="url"
                                    id="bg-url"
                                    value={bgUrl}
                                    onChange={(e) => setBgUrl(e.target.value)}
                                    placeholder={t.backgroundImagePlaceholder}
                                    className={inputClasses}
                                />
                            </div>
                            <button type="submit" className="px-4 py-2 bg-primary dark:bg-dark-primary text-white dark:text-dark-background rounded-md hover:bg-opacity-90">{t.updateSettings}</button>
                        </form>
                    </div>

                    {/* Meal Management */}
                    <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
                        <h2 className="text-2xl font-semibold text-primary dark:text-dark-primary mb-4">{t.mealManagement}</h2>
                        <form onSubmit={handleAddMeal} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                             <h3 className="md:col-span-2 text-lg font-medium">{t.addMealTitle}</h3>
                            <div>
                                <label className={labelClasses}>{t.mealName}</label>
                                <input name="name" value={newMeal.name} onChange={handleMealInputChange} className={inputClasses} required />
                            </div>
                             <div>
                                <label className={labelClasses}>{t.mealCalories}</label>
                                <input type="number" name="calories" value={newMeal.calories} onChange={handleMealInputChange} className={inputClasses} required />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClasses}>{t.mealDescription}</label>
                                <textarea name="description" value={newMeal.description} onChange={handleMealInputChange} rows={2} className={inputClasses} required></textarea>
                            </div>
                             <div>
                                <label className={labelClasses}>{t.mealCategory}</label>
                                <select name="category" value={newMeal.category} onChange={handleMealInputChange} className={inputClasses}>
                                    {mealCategories.map(c => <option key={c} value={c}>{t[`category${c.replace(/\s/g, '')}`]}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className={labelClasses}>{t.mealTime}</label>
                                <select name="time" value={newMeal.time} onChange={handleMealInputChange} className={inputClasses}>
                                    {mealTimes.map(timeValue => <option key={timeValue} value={timeValue}>{t[`time${timeValue}`]}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" className="w-full px-4 py-2 bg-accent dark:bg-dark-accent text-primary dark:text-dark-background font-semibold rounded-md hover:opacity-90">{t.addMealButton}</button>
                            </div>
                        </form>

                        <h3 className="text-lg font-medium border-t dark:border-dark-border pt-4">{t.addedMealsTitle} ({customMeals.length})</h3>
                        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                            {customMeals.length > 0 ? customMeals.map((meal, index) => (
                                <div key={index} className="p-2 bg-neutral-light dark:bg-dark-background rounded-md text-sm">
                                    <p className="font-semibold">{meal.name} <span className="font-normal text-xs">({meal.calories} kcal)</span></p>
                                    <p className="text-gray-600 dark:text-dark-text-secondary">
                                        {t[`category${meal.category.replace(/\s/g, '')}`]} - {t[`time${meal.time}`]}
                                    </p>
                                </div>
                            )) : <p className="text-sm text-gray-500 dark:text-dark-text-secondary">No custom meals added yet.</p>}
                        </div>
                    </div>

                     {/* Drink Management */}
                    <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
                        <h2 className="text-2xl font-semibold text-primary dark:text-dark-primary mb-4">{t.drinkManagement}</h2>
                        <form onSubmit={handleAddDrink} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                             <h3 className="md:col-span-2 text-lg font-medium">{t.addDrinkTitle}</h3>
                            <div>
                                <label className={labelClasses}>{t.drinkName}</label>
                                <input name="name" value={newDrink.name} onChange={handleDrinkInputChange} className={inputClasses} required />
                            </div>
                             <div>
                                <label className={labelClasses}>{t.drinkCalories}</label>
                                <input type="number" name="calories" value={newDrink.calories} onChange={handleDrinkInputChange} className={inputClasses} required />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClasses}>{t.drinkDescription}</label>
                                <textarea name="description" value={newDrink.description} onChange={handleDrinkInputChange} rows={2} className={inputClasses} required></textarea>
                            </div>
                             <div>
                                <label className={labelClasses}>{t.drinkCategory}</label>
                                <select name="category" value={newDrink.category} onChange={handleDrinkInputChange} className={inputClasses}>
                                    {drinkCategories.map(c => <option key={c} value={c}>{t[`category${c.replace(/\s/g, '')}`]}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" className="w-full px-4 py-2 bg-accent dark:bg-dark-accent text-primary dark:text-dark-background font-semibold rounded-md hover:opacity-90">{t.addDrinkButton}</button>
                            </div>
                        </form>

                        <h3 className="text-lg font-medium border-t dark:border-dark-border pt-4">{t.addedDrinksTitle} ({customDrinks.length})</h3>
                        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                            {customDrinks.length > 0 ? customDrinks.map((drink, index) => (
                                <div key={index} className="p-2 bg-neutral-light dark:bg-dark-background rounded-md text-sm">
                                    <p className="font-semibold">{drink.name} <span className="font-normal text-xs">({drink.calories} kcal)</span></p>
                                    <p className="text-gray-600 dark:text-dark-text-secondary">
                                        {t[`category${drink.category.replace(/\s/g, '')}`]}
                                    </p>
                                </div>
                            )) : <p className="text-sm text-gray-500 dark:text-dark-text-secondary">No custom drinks added yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
