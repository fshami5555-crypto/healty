import React, { useState, useEffect, useCallback } from 'react';
import type { User, View, ChatMessage, DietPlan, WorkoutPlan, UserProfileData, CompletionStatus, MealItem, MealSubscriptionData } from './types';
import Login from './components/Login';
import Header from './components/Header';
import Profile from './components/Profile';
import Chat from './components/Chat';
import AdminDashboard from './components/AdminDashboard';
import Settings from './components/Settings';
import SplashScreen from './components/SplashScreen';
import ManualQuestionnaire from './components/ManualQuestionnaire';
import BottomNavBar from './components/BottomNavBar';
import Statistics from './components/Statistics';
import Market from './components/Market';
import Cafe from './components/Cafe';
import MealSubscription from './components/MealSubscription';
import NotificationContainer from './components/NotificationContainer';
import OnboardingTour from './components/OnboardingTour';
import LoadingOverlay from './components/LoadingOverlay';
import CartModal from './components/CartModal';

import { useApp } from './contexts/AppContext';
import { useLanguage } from './contexts/LanguageContext';
import { useNotification } from './contexts/NotificationContext';
import { getAiResponse } from './services/geminiService';
import { generateDietPlan } from './mock/dietPlanGenerator';


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [userProfileData, setUserProfileData] = useState<UserProfileData | null>(null);
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>({});
  const [mealSubscriptionData, setMealSubscriptionData] = useState<MealSubscriptionData | null>(null);

  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { addUser } = useApp();
  const { language } = useLanguage();
  const { addNotification } = useNotification();

  useEffect(() => {
    // Simulate loading time for splash screen
    const timer = setTimeout(() => setAppReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    addUser(loggedInUser);
    if (loggedInUser.isNewUser) {
        setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('profile');
    setConversation([]);
    setDietPlan(null);
    setWorkoutPlan(null);
    setUserProfileData(null);
  };

  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = { sender: 'user', text: message };
    const newConversation = [...conversation, userMessage];
    setConversation(newConversation);
    setIsAiLoading(true);

    try {
        const hasDietPlan = !!dietPlan;
        const hasWorkoutPlan = !!workoutPlan;
        const aiResponse = await getAiResponse(newConversation, language, hasDietPlan, hasWorkoutPlan);

        if (aiResponse.text === 'PLAN_READY') {
            if (userProfileData) {
                const newDietPlan = generateDietPlan(userProfileData, language);
                setDietPlan(newDietPlan);
                addNotification({ type: 'success', message: 'Your diet plan is ready!' });
                const planMessage: ChatMessage = { sender: 'ai', text: "Great! I've created your personalized diet plan. You can view it on your profile." };
                setConversation(prev => [...prev, planMessage]);
            }
        } else {
            const aiMessage: ChatMessage = { sender: 'ai', text: aiResponse.text };
            setConversation(prev => [...prev, aiMessage]);
        }
        
        if (aiResponse.workoutPlan) {
            setWorkoutPlan(aiResponse.workoutPlan);
            addNotification({ type: 'success', message: 'Your workout plan is ready!' });
        }
    } catch (error) {
        console.error("Failed to get AI response:", error);
        addNotification({ type: 'error', message: 'Failed to connect to the AI service.' });
    } finally {
        setIsAiLoading(false);
    }
  }, [conversation, dietPlan, workoutPlan, language, userProfileData, addNotification]);
  
  const handleQuestionnaireSubmit = (data: UserProfileData) => {
      setUserProfileData(data);
      const newDietPlan = generateDietPlan(data, language);
      setDietPlan(newDietPlan);
      setView('profile');
      addNotification({ type: 'success', message: "Your profile and diet plan have been updated!"});
  };

  const handleToggleComplete = (date: string, type: 'meal' | 'exercise', name: string) => {
      setCompletionStatus(prev => {
          const newStatus = { ...prev };
          if (!newStatus[date]) {
              newStatus[date] = { meals: [], exercises: [] };
          }
          const list = type === 'meal' ? newStatus[date].meals : newStatus[date].exercises;
          const index = list.indexOf(name);
          if (index > -1) {
              list.splice(index, 1);
          } else {
              list.push(name);
          }
          return newStatus;
      });
  };

  const handleAddCustomMeals = (meals: MealItem[], date: string) => {
    setDietPlan(prevPlan => {
        if (!prevPlan) return null;
        const newPlan = { ...prevPlan, schedule: { ...prevPlan.schedule } };
        if (!newPlan.schedule[date]) {
             newPlan.schedule[date] = JSON.parse(JSON.stringify(newPlan.template));
        }
        // Assuming custom meals are snacks for simplicity
        newPlan.schedule[date].snack = [...newPlan.schedule[date].snack, ...meals];
        return newPlan;
    });
  };
  
  const handleMealSubscriptionSubmit = (data: MealSubscriptionData) => {
    setMealSubscriptionData(data);
    setView('profile');
    addNotification({ type: 'success', message: "You've successfully subscribed to meal delivery!" });
  };


  const renderView = () => {
    switch (view) {
      case 'profile':
        return <Profile 
            user={user!} 
            dietPlan={dietPlan} 
            workoutPlan={workoutPlan}
            userProfileData={userProfileData}
            completionStatus={completionStatus}
            mealSubscriptionData={mealSubscriptionData}
            onNavigate={setView} 
            onToggleComplete={handleToggleComplete}
            onAddCustomMeals={handleAddCustomMeals}
        />;
      case 'chat':
        return <Chat 
            conversation={conversation} 
            onSendMessage={handleSendMessage} 
            isLoading={isAiLoading} 
            hasDietPlan={!!dietPlan}
            onNavigate={setView}
        />;
      case 'admin':
        return <AdminDashboard />;
      case 'questionnaire':
          return <ManualQuestionnaire onSubmit={handleQuestionnaireSubmit} existingData={userProfileData} />;
      case 'settings':
          return <Settings user={user} onUpdateUser={setUser} />;
      case 'statistics':
          return <Statistics dietPlan={dietPlan} workoutPlan={workoutPlan} completionStatus={completionStatus} />;
      case 'market':
          return <Market onOpenCart={() => setIsCartOpen(true)} />;
      case 'cafe':
          return <Cafe />;
      case 'meal-subscription':
          return <MealSubscription onSubmit={handleMealSubscriptionSubmit} />;
      default:
        return <Profile user={user!} dietPlan={dietPlan} workoutPlan={workoutPlan} userProfileData={userProfileData} completionStatus={completionStatus} mealSubscriptionData={mealSubscriptionData} onNavigate={setView} onToggleComplete={handleToggleComplete} onAddCustomMeals={handleAddCustomMeals} />;
    }
  };

  if (!appReady) {
    return <SplashScreen />;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }
  
  return (
    <div className="bg-background dark:bg-dark-background min-h-screen font-sans text-text-dark dark:text-dark-text transition-colors duration-300">
      <Header user={user} onNavigate={setView} onLogout={handleLogout} />
      <main className="container mx-auto p-4 pb-24">
        {renderView()}
      </main>
      <BottomNavBar currentView={view} onNavigate={setView} />
      <NotificationContainer />
      <LoadingOverlay isVisible={isLoading} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {showOnboarding && (
          <OnboardingTour
              step={onboardingStep}
              onNext={() => setOnboardingStep(s => s + 1)}
              onSkip={() => setShowOnboarding(false)}
              onFinish={() => setShowOnboarding(false)}
           />
      )}
    </div>
  );
};

export default App;