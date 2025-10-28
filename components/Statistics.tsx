import React, { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
// Fix: Corrected import path for types
import type { DietPlan, WorkoutPlan, CompletionStatus } from '../types';
import { ChartBarIcon, CheckCircleIcon } from './Icons';

interface StatisticsProps {
    dietPlan: DietPlan | null;
    workoutPlan: WorkoutPlan | null;
    completionStatus: CompletionStatus;
}

const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const Statistics: React.FC<StatisticsProps> = ({ dietPlan, workoutPlan, completionStatus }) => {
    const { t, language } = useLanguage();

    const weeklyStats = useMemo(() => {
        if (!dietPlan) return [];
        const today = new Date();
        const stats = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = formatDate(date);

            const mealsForDay = dietPlan.schedule[dateString] || dietPlan.template;
            const totalMeals = mealsForDay.breakfast.length + mealsForDay.lunch.length + mealsForDay.dinner.length + mealsForDay.snack.length;
            const completedMeals = completionStatus[dateString]?.meals.length || 0;
            const dietAdherence = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;
            
            let totalExercises = 0;
            let completedExercises = 0;
            let workoutAdherence = 0;

            if (workoutPlan) {
                const dayOfWeek = date.getDay();
                // Sunday is 0, Monday is 1, etc. Match with array index.
                const workoutDayIndex = (dayOfWeek + 6) % 7; // Assuming workout plan starts on Monday
                if (workoutPlan.days.length > workoutDayIndex) {
                    const workoutForDay = workoutPlan.days[workoutDayIndex];
                    if (workoutForDay) {
                        totalExercises = workoutForDay.exercises.length;
                        completedExercises = completionStatus[dateString]?.exercises.length || 0;
                        workoutAdherence = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
                    }
                }
            }
            
            stats.push({
                date,
                dietAdherence,
                workoutAdherence,
                completedMeals,
                totalMeals,
                completedExercises,
                totalExercises,
            });
        }
        return stats;
    }, [dietPlan, workoutPlan, completionStatus]);

    const overallAdherence = useMemo(() => {
        if (weeklyStats.length === 0) return 0;
        const totalAdherence = weeklyStats.reduce((sum, day) => sum + day.dietAdherence + day.workoutAdherence, 0);
        const totalPossibleAdherence = weeklyStats.length * (workoutPlan ? 200 : 100);
        if (totalPossibleAdherence === 0) return 0;
        return Math.round(totalAdherence / totalPossibleAdherence * 100);
    }, [weeklyStats, workoutPlan]);

    const totalCompletedMeals = useMemo(() => weeklyStats.reduce((sum, day) => sum + day.completedMeals, 0), [weeklyStats]);
    const totalScheduledMeals = useMemo(() => weeklyStats.reduce((sum, day) => sum + day.totalMeals, 0), [weeklyStats]);
    const totalCompletedWorkouts = useMemo(() => weeklyStats.reduce((sum, day) => sum + day.completedExercises, 0), [weeklyStats]);
    const totalScheduledWorkouts = useMemo(() => weeklyStats.reduce((sum, day) => sum + day.totalExercises, 0), [weeklyStats]);


    if (!dietPlan) {
        return (
            <div className="text-center p-10 bg-white dark:bg-dark-surface rounded-lg shadow-lg animate-slideInUp">
                <ChartBarIcon className="w-16 h-16 mx-auto text-neutral-light dark:text-dark-border" />
                <h2 className="text-2xl font-bold text-primary dark:text-dark-primary mt-4 mb-2">{t.noData}</h2>
                <p className="text-text-dark dark:text-dark-text">{t.noStatsMessage}</p>
            </div>
        );
    }
    
    const Bar: React.FC<{ percentage: number; colorClass: string; label: string }> = ({ percentage, colorClass, label }) => (
        <div className="w-1/2 px-2 flex flex-col items-center">
            <div className="w-full h-32 bg-gray-200 dark:bg-dark-border rounded-t-md overflow-hidden flex flex-col justify-end">
                <div 
                    className={`${colorClass} transition-all duration-500`} 
                    style={{ height: `${percentage}%` }}
                ></div>
            </div>
            <span className="text-xs mt-1">{label}</span>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="text-center animate-slideInUp">
                <h1 className="text-4xl font-bold text-primary dark:text-dark-primary">{t.statisticsTitle}</h1>
                <p className="mt-2 text-secondary-dark dark:text-dark-text-secondary">{t.statisticsSubtitle}</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideInUp">
                 <div className="p-6 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-neutral-light dark:border-dark-border text-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-dark-text-secondary">{t.overallAdherence}</h3>
                    <p className="text-5xl font-bold text-primary dark:text-dark-primary mt-2">{overallAdherence}%</p>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-2">{t.keepItUp}</p>
                 </div>
                 <div className="p-6 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-neutral-light dark:border-dark-border text-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-dark-text-secondary">{t.totalMealsCompleted}</h3>
                    <p className="text-5xl font-bold text-primary dark:text-dark-primary mt-2">{totalCompletedMeals}<span className="text-2xl text-gray-400">/{totalScheduledMeals}</span></p>
                 </div>
                 <div className="p-6 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-neutral-light dark:border-dark-border text-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-dark-text-secondary">{t.totalWorkoutsCompleted}</h3>
                    <p className="text-5xl font-bold text-primary dark:text-dark-primary mt-2">{totalCompletedWorkouts}<span className="text-2xl text-gray-400">/{totalScheduledWorkouts}</span></p>
                 </div>
            </div>

            {/* Weekly Chart */}
            <div className="p-6 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-neutral-light dark:border-dark-border animate-slideInUp">
                <h2 className="text-2xl font-semibold text-primary dark:text-dark-primary mb-4">{t.weeklyAdherence}</h2>
                <div className="flex justify-between items-end h-48 space-x-2">
                    {weeklyStats.map(day => (
                        <div key={day.date.toString()} className="flex-1 flex flex-col items-center">
                             <div className="flex items-end h-full w-full">
                                <Bar percentage={day.dietAdherence} colorClass="bg-primary dark:bg-dark-primary" label={t.dietProgress} />
                                {workoutPlan && <Bar percentage={day.workoutAdherence} colorClass="bg-secondary dark:bg-dark-secondary" label={t.workoutProgress} />}
                             </div>
                            <span className="text-xs text-gray-500 dark:text-dark-text-secondary mt-2">{day.date.toLocaleString(language, { weekday: 'short' })}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Statistics;
