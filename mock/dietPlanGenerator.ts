// Fix: Corrected import path for types
import type { UserProfileData, DietPlan, DailyMeals, Language } from '../types';

// Simple calorie estimation (very rough) based on Mifflin-St Jeor Equation
const calculateBMR = (data: UserProfileData): number => {
  const weight = parseFloat(data.weight);
  const height = parseFloat(data.height);
  const age = parseInt(data.age, 10);
  if (data.gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

// Mock meal data
const mealsEN = {
  breakfast: [{ name: 'Oatmeal with Berries', description: 'A healthy start to your day.', calories: 300 }, { name: 'Scrambled Eggs with Spinach', description: 'Protein-packed breakfast.', calories: 250 }],
  lunch: [{ name: 'Grilled Chicken Salad', description: 'Lean protein and fresh greens.', calories: 450 }, { name: 'Quinoa Bowl with Vegetables', description: 'A balanced and nutritious lunch.', calories: 400 }],
  dinner: [{ name: 'Salmon with Roasted Asparagus', description: 'Rich in Omega-3 fatty acids.', calories: 500 }, { name: 'Lentil Soup', description: 'A hearty and warming dinner.', calories: 350 }],
  snack: [{ name: 'Greek Yogurt', description: 'A great source of protein.', calories: 150 }, { name: 'Apple with Peanut Butter', description: 'A classic healthy snack.', calories: 200 }],
};

const mealsAR = {
  breakfast: [{ name: 'شوفان بالتوت', description: 'بداية صحية ليومك.', calories: 300 }, { name: 'بيض مخفوق بالسبانخ', description: 'إفطار غني بالبروتين.', calories: 250 }],
  lunch: [{ name: 'سلطة دجاج مشوي', description: 'بروتين خفيف وخضروات طازجة.', calories: 450 }, { name: 'وعاء كينوا بالخضروات', description: 'غداء متوازن ومغذي.', calories: 400 }],
  dinner: [{ name: 'سلمون مع هليون مشوي', description: 'غني بأحماض أوميغا 3 الدهنية.', calories: 500 }, { name: 'شوربة عدس', description: 'عشاء دافئ ومُشبع.', calories: 350 }],
  snack: [{ name: 'زبادي يوناني', description: 'مصدر رائع للبروتين.', calories: 150 }, { name: 'تفاح مع زبدة الفول السوداني', description: 'وجبة خفيفة صحية كلاسيكية.', calories: 200 }],
};

export const generateDietPlan = (userData: UserProfileData, language: Language): DietPlan => {
  const bmr = calculateBMR(userData);
  const dailyCaloricIntake = Math.round(bmr * activityMultipliers[userData.activityLevel]);

  const meals = language === 'ar' ? mealsAR : mealsEN;
  
  // A very simple meal assignment logic
  const template: DailyMeals = {
    breakfast: [meals.breakfast[0]],
    lunch: [meals.lunch[0]],
    dinner: [meals.dinner[0]],
    snack: [meals.snack[0]],
  };

  const schedule: Record<string, DailyMeals> = {};
  const today = new Date();
  for (let i = -7; i < 14; i++) { // Generate for a wider range of dates for better testing
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    // Alternate meals for variety
    schedule[dateString] = {
      breakfast: [meals.breakfast[Math.abs(i % 2)]],
      lunch: [meals.lunch[Math.abs(i % 2)]],
      dinner: [meals.dinner[Math.abs(i % 2)]],
      snack: [meals.snack[Math.abs(i % 2)]],
    };
  }

  return {
    summary: language === 'ar' ? `خطة مخصصة لك بناءً على أهدافك.` : `A personalized plan for you based on your goals.`,
    dailyCaloricIntake: dailyCaloricIntake,
    macronutrientTargets: {
      protein: `${Math.round(dailyCaloricIntake * 0.3 / 4)}g`,
      carbohydrates: `${Math.round(dailyCaloricIntake * 0.4 / 4)}g`,
      fat: `${Math.round(dailyCaloricIntake * 0.3 / 9)}g`,
    },
    template: template,
    schedule: schedule,
  };
};
