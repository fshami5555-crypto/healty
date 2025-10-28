import React, { createContext, useState, useContext, useMemo, ReactNode } from 'react';
// Fix: Corrected import path for types
import type { CustomMeal, User, CustomDrink } from '../types';

// Mock users for demonstration
const initialUsers: User[] = [
    { name: "Alice", email: "alice@example.com", isAdmin: false, phone: "+15551234567" },
    { name: "Bob", email: "bob@example.com", isAdmin: false, phone: "+15557654321" },
];

const initialMeals: CustomMeal[] = [
    { id: 1, name: 'Grilled Chicken Salad', description: 'Lean protein and fresh greens.', calories: 450, category: 'Weight Loss', time: 'Lunch', price: 7.50, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, name: 'Salmon with Asparagus', description: 'Rich in Omega-3 fatty acids.', calories: 500, category: 'Healthy Lifestyle', time: 'Dinner', price: 9.99, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1974&auto=format&fit=crop' },
    { id: 3, name: 'Protein Pancakes', description: 'Start your day with a protein punch.', calories: 350, category: 'Muscle Gain', time: 'Breakfast', price: 5.00, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=2070&auto=format=fit=crop'},
    { id: 4, name: 'Quinoa Bowl', description: 'A balanced and nutritious lunch.', calories: 400, category: 'Healthy Lifestyle', time: 'Lunch', price: 6.50, image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1964&auto=format=fit=crop'},
    { id: 5, name: 'Bodybuilder Steak', description: 'Heavy protein for maximum gains.', calories: 800, category: 'Bodybuilding', time: 'Dinner', price: 12.50, image: 'https://images.unsplash.com/photo-1529692236671-f1f6b5f46b54?q=80&w=2070&auto=format&fit=crop'},
    { id: 6, name: 'Fitness Fruit Bowl', description: 'Light, refreshing, and full of vitamins.', calories: 250, category: 'Fitness', time: 'Snack', price: 4.25, image: 'https://images.unsplash.com/photo-1585059242009-3c2c48d64110?q=80&w=1974&auto=format&fit=crop'}
];

interface AppContextType {
  users: User[];
  addUser: (user: User) => void;
  customMeals: CustomMeal[];
  addCustomMeal: (meal: CustomMeal) => void;
  customDrinks: CustomDrink[];
  addCustomDrink: (drink: CustomDrink) => void;
  backgroundImage: string;
  setBackgroundImage: (url: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [customMeals, setCustomMeals] = useState<CustomMeal[]>(initialMeals);
  const [customDrinks, setCustomDrinks] = useState<CustomDrink[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  const addUser = (user: User) => {
    // Prevent adding duplicates
    if (!users.find(u => u.email === user.email)) {
        setUsers(prev => [...prev, user]);
    }
  };
  
  const addCustomMeal = (meal: CustomMeal) => {
    const newMealWithId = { ...meal, id: Date.now() }; // Ensure unique ID
    setCustomMeals(prev => [newMealWithId, ...prev]);
  };

  const addCustomDrink = (drink: CustomDrink) => {
    setCustomDrinks(prev => [...prev, drink]);
  };

  const value = useMemo(() => ({
    users,
    addUser,
    customMeals,
    addCustomMeal,
    customDrinks,
    addCustomDrink,
    backgroundImage,
    setBackgroundImage,
  }), [users, customMeals, customDrinks, backgroundImage]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};