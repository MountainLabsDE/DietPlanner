export interface MealPlanConfig {
  dietProfileId: string;
  mealsPerDay: number;
  numberOfDays: number;
  dailyCalories?: number;
  excludedRecipes?: string[];
  variety: 'low' | 'medium' | 'high';
}

export interface MealPlanDay {
  date: string;
  dayNumber: number;
  meals: MealPlanMeal[];
  dailyTotals: DailyMacros;
}

export interface MealPlanMeal {
  id: string;
  mealType: string;
  order: number;
  recipeId?: string;
  recipe?: {
    id: string;
    name: string;
    images: string[];
    nutrition: MealNutrition;
    prepTime: number;
    servings: number;
  };
}

export interface MealNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  targetCalories?: number;
}

export interface MealPlan {
  id: string;
  name?: string;
  userId: string;
  config: MealPlanConfig;
  days: MealPlanDay[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  shareCode?: string;
}

export interface MealPlanResponse {
  items: MealPlan[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const MEAL_TYPE_OPTIONS = [
  { value: 'BREAKFAST', label: 'Breakfast', icon: '🌅' },
  { value: 'LUNCH', label: 'Lunch', icon: '☀️' },
  { value: 'SNACK', label: 'Snack', icon: '🍎' },
  { value: 'DINNER', label: 'Dinner', icon: '🌙' },
] as const;

export const VARIETY_OPTIONS = [
  { value: 'low', label: 'Low Variety', description: 'Fewer recurring meals, simpler planning' },
  { value: 'medium', label: 'Medium Variety', description: 'Balanced mix of familiar and new meals' },
  { value: 'high', label: 'High Variety', description: 'Maximum diversity, try new foods daily' },
] as const;

export const MEALS_PER_DAY_OPTIONS = [
  { value: 3, label: '3 Meals', meals: ['BREAKFAST', 'LUNCH', 'DINNER'] },
  { value: 4, label: '3 Meals + 1 Snack', meals: ['BREAKFAST', 'LUNCH', 'SNACK', 'DINNER'] },
  { value: 5, label: '3 Meals + 2 Snacks', meals: ['BREAKFAST', 'SNACK', 'LUNCH', 'SNACK', 'DINNER'] },
  { value: 6, label: '3 Meals + 3 Snacks', meals: ['BREAKFAST', 'SNACK', 'LUNCH', 'SNACK', 'SNACK', 'DINNER'] },
] as const;

export const DAYS_OPTIONS = [
  { value: 1, label: '1 Day (Single Day)' },
  { value: 7, label: '1 Week (7 Days)' },
  { value: 14, label: '2 Weeks (14 Days)' },
  { value: 21, label: '3 Weeks (21 Days)' },
  { value: 28, label: '4 Weeks (28 Days)' },
] as const;
