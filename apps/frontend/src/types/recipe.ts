export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface Ingredient {
  name: string;
  amount?: string;
  notes?: string;
}

export interface PreparationStep {
  stepNumber: number;
  instruction: string;
  durationMinutes?: number;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  images: string[];
  prepTime: number;
  cookTime?: number;
  servings: number;
  difficulty?: string;
  tags: string[];
  restrictions?: string[];
  createdAt: string;
  updatedAt: string;
  mealType?: string;
  nutrition: NutritionInfo;
  ingredients: Ingredient[];
  preparationSteps?: PreparationStep[] | any;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export interface RecipeFilters {
  search?: string;
  tags?: string[];
  restrictions?: string[];
  maxCalories?: number;
  mealType?: string;
  page?: number;
  limit?: number;
}

export interface RecipeResponse {
  items: Recipe[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const MEAL_TYPES = [
  { value: 'BREAKFAST', label: 'Breakfast', color: 'bg-yellow-400' },
  { value: 'LUNCH', label: 'Lunch', color: 'bg-orange-400' },
  { value: 'DINNER', label: 'Dinner', color: 'bg-red-400' },
  { value: 'SNACK', label: 'Snack', color: 'bg-purple-400' },
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 1, label: 'Very Easy', color: 'bg-green-400' },
  { value: 2, label: 'Easy', color: 'bg-emerald-400' },
  { value: 3, label: 'Medium', color: 'bg-yellow-400' },
  { value: 4, label: 'Hard', color: 'bg-orange-400' },
  { value: 5, label: 'Very Hard', color: 'bg-red-400' },
] as const;
