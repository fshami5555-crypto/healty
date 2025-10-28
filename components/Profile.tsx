import React, { useState } from 'react';
// Fix: Corrected import path for types
import type { User, View, DietPlan, WorkoutPlan, UserProfileData, CompletionStatus, MealItem, MealSubscriptionData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ChefIcon, PlusCircleIcon, TruckIcon } from './Icons';
import MealCard from './MealCard';
import WorkoutCard from './WorkoutCard';
import UserProfileSummary from './UserProfileSummary';
import MealSelectionModal from './MealSelectionModal';
import SubscriptionSummaryCard from './SubscriptionSummaryCard';

interface ProfileProps {
    user: User;
    dietPlan: DietPlan | null;
    workoutPlan: WorkoutPlan | null;
    userProfileData: UserProfileData | null;
    completionStatus: CompletionStatus;
    mealSubscriptionData: MealSubscriptionData | null;
    onNavigate: (view: View) => void;
    onToggleComplete: (date: string, type: 'meal' | 'exercise', name: string) => void;
    onAddCustomMeals: (meals: MealItem[], date: string) => void;
}

const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const Profile: React.FC<ProfileProps> = ({ user, dietPlan, workoutPlan, userProfileData, completionStatus, mealSubscriptionData, onNavigate, onToggleComplete, onAddCustomMeals }) => {
    const { t, language } = useLanguage();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dateString = formatDate(selectedDate);
    const dailyCompletion = completionStatus[dateString] || { meals: [], exercises: [] };

    const mealsForDay = dietPlan?.schedule[dateString] || dietPlan?.template;
    const workoutForDay = workoutPlan?.days[selectedDate.getDay() % (workoutPlan?.days.length || 1)];

    const handleDateChange = (daysToAdd: number) => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + daysToAdd);
            return newDate;
        });
    };

    const handleSaveCustomMeals = (meals: MealItem[]) => {
        onAddCustomMeals(meals, dateString);
        setIsModalOpen(false);
    };

    if (!dietPlan || !userProfileData) {
        return (
            <div id="tour-dashboard-card" className="text-center p-8 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
                <ChefIcon className="w-16 h-16 mx-auto text-primary dark:text-dark-primary" />
                <h2 className="mt-4 text-2xl font-bold text-text-dark dark:text-dark-text">{t.welcomeMessage.replace('{name}', user.name)}</h2>
                <p className="mt-2 text-gray-600 dark:text-dark-text-secondary">{t.getStartedPrompt}</p>
                <div className="mt-6 flex justify-center gap-4">
                    <button id="tour-chat-button" onClick={() => onNavigate('chat')} className="px-6 py-3 font-semibold rounded-lg text-white bg-primary dark:bg-dark-primary hover:bg-opacity-90">{t.startChatting}</button>
                    <button onClick={() => onNavigate('questionnaire')} className="px-6 py-3 font-semibold rounded-lg text-primary dark:text-dark-primary bg-accent dark:bg-dark-accent hover:bg-opacity-80">{t.fillQuestionnaire}</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <UserProfileSummary data={userProfileData} onEdit={() => onNavigate('questionnaire')} />

            {mealSubscriptionData ? (
                <SubscriptionSummaryCard subscription={mealSubscriptionData} onManage={() => onNavigate('meal-subscription')} />
            ) : (
                <div className="p-4 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
                    <button onClick={() => onNavigate('meal-subscription')} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-md font-bold text-primary dark:text-dark-primary bg-primary/10 dark:bg-dark-primary/10 rounded-lg hover:bg-primary/20 dark:hover:bg-dark-primary/20 transition-colors">
                        <TruckIcon className="w-6 h-6" />
                        {t.subscribeToMeals}
                    </button>
                </div>
            )}


            <div id="tour-dashboard-card" className="p-4 sm:p-6 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => handleDateChange(-1)} className="px-3 py-1.5 text-sm rounded-md bg-gray-200 dark:bg-dark-border hover:bg-gray-300 dark:hover:bg-opacity-80">{"<"}</button>
                    <h3 className="text-xl font-bold text-center text-primary dark:text-dark-primary">
                        {selectedDate.toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>
                    <button onClick={() => handleDateChange(1)} className="px-3 py-1.5 text-sm rounded-md bg-gray-200 dark:bg-dark-border hover:bg-gray-300 dark:hover:bg-opacity-80">{">"}</button>
                </div>

                {/* Meals Section */}
                {mealsForDay && (
                    <div className="space-y-4">
                        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(mealTime => (
                            mealsForDay[mealTime].length > 0 && (
                                <div key={mealTime}>
                                    <h4 className="text-lg font-semibold capitalize text-text-dark dark:text-dark-text mb-2">{t[`time${mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}`]}</h4>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {mealsForDay[mealTime].map(meal => (
                                            <MealCard 
                                                key={meal.name} 
                                                meal={meal} 
                                                date={dateString}
                                                isCompleted={dailyCompletion.meals.includes(meal.name)}
                                                onToggleComplete={onToggleComplete}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                         <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 text-sm font-semibold text-primary dark:text-dark-primary bg-primary/10 dark:bg-dark-primary/10 rounded-lg hover:bg-primary/20 dark:hover:bg-dark-primary/20 transition-colors">
                            <PlusCircleIcon className="w-5 h-5" />
                            {t.addCustomMeal}
                        </button>
                    </div>
                )}

                {/* Workout Section */}
                {workoutForDay && (
                    <div className="mt-8 pt-6 border-t dark:border-dark-border">
                         <h3 className="text-2xl font-bold text-primary dark:text-dark-primary mb-4">{workoutForDay.focus}</h3>
                         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {workoutForDay.exercises.map(ex => (
                                <WorkoutCard 
                                    key={ex.name} 
                                    exercise={ex} 
                                    date={dateString}
                                    isCompleted={dailyCompletion.exercises.includes(ex.name)}
                                    onToggleComplete={onToggleComplete}
                                />
                            ))}
                         </div>
                    </div>
                )}
                 {!workoutForDay && workoutPlan && (
                     <div className="mt-8 pt-6 border-t dark:border-dark-border text-center">
                         <p className="text-lg font-semibold text-gray-500 dark:text-dark-text-secondary">{t.restDay}</p>
                    </div>
                 )}
            </div>
             <MealSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveCustomMeals} />
        </div>
    );
};

export default Profile;
