export type Language = 'en' | 'ar';

export type View = 'profile' | 'chat' | 'admin' | 'questionnaire' | 'market' | 'cafe' | 'settings' | 'statistics' | 'subscription' | 'meal-subscription';

export interface User {
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  isNewUser?: boolean;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface MealItem {
  name: string;
  description: string;
  calories: number;
}

export interface DailyMeals {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snack: MealItem[];
}

export interface DietPlan {
  summary: string;
  dailyCaloricIntake: number;
  macronutrientTargets: {
    protein: string;
    carbohydrates: string;
    fat: string;
  };
  template: DailyMeals;
  schedule: Record<string, DailyMeals>;
}

export interface Exercise {
    name: string;
    sets: string;
    reps: string;
    description: string;
}

export interface WorkoutDay {
    day: string;
    focus: string;
    exercises: Exercise[];
}

export interface WorkoutPlan {
    notes: string;
    days: WorkoutDay[];
}

export interface UserProfileData {
    gender: 'male' | 'female';
    age: string;
    weight: string;
    height: string;
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
    preferences: string;
    allergies: string;
}

export interface CompletionStatus {
    [date: string]: {
        meals: string[];
        exercises: string[];
    };
}

export type MealCategory = 'Weight Loss' | 'Muscle Gain' | 'Healthy Lifestyle' | 'Bodybuilding' | 'Fitness';
export type MealTime = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface CustomMeal extends MealItem {
    id: number;
    price: number;
    image: string;
    category: MealCategory;
    time: MealTime;
}

export type DrinkCategory = 'Hot Drinks' | 'Cold Drinks' | 'Protein Shakes' | 'Juices';

export interface CustomDrink extends MealItem {
    category: DrinkCategory;
}

export interface Notification {
    id: number;
    type: 'success' | 'error' | 'info';
    message: string;
}

export interface CartItem extends CustomMeal {
    quantity: number;
}


export interface MealSubscriptionData {
    planType: 'weekly' | 'monthly';
    mealPackage: 'lunch' | 'lunch_dinner' | 'all';
    deliveryTime: 'morning' | 'evening';
    governorate: string;
    area: string;
    phone: string;
}