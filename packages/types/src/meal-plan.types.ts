export interface MacroBreakdown {
  protein: number; // grams consumed
  carbs: number; // grams consumed
  fats: number; // grams consumed
  fiber?: number; // grams consumed
}

export interface TrackedMeal {
  id: string;
  recipeId: string;
  recipeName: string;
  servings: number;
  caloriesConsumed: number;
  macros: MacroBreakdown;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
}

export interface DailyTracking {
  id: string;
  userId: string;
  date: Date;
  meals: TrackedMeal[];
  water: number; // ml
  weight?: number; // kg
  calories: {
    consumed: number;
    target: number;
  };
  macros: {
    consumed: MacroBreakdown;
    target: MacroBreakdown;
  };
  completedGoals: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: string;
  recipeId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time?: string;
}

export interface DayMealPlan {
  day: number;
  date: Date;
  meals: Meal[];
  totalCalories: number;
  totalMacros: MacroBreakdown;
}

export interface MealPlanConfig {
  profileIds: string[];
  mealsPerDay: number;
  calories: {
    target: number;
    min: number;
    max: number;
  };
  macros: MacroBreakdown;
  duration: number; // days
  preferences: {
    cuisines: string[];
    cookingTime: {
      min: number;
      max: number;
    };
    difficulty: 'easy' | 'medium' | 'hard';
    budget?: 'low' | 'medium' | 'high';
  };
}

export interface MealPlan {
  id: string;
  userId: string;
  profileId: string;
  name: string;
  config: MealPlanConfig;
  days: DayMealPlan[];
  generatedAt: Date;
  isFavorite: boolean;
  shares: number;
  createdAt: Date;
}
