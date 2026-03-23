export interface NutritionInfo {
  calories: number;
  macros: {
    protein: number; // grams
    carbs: number; // grams
    fats: number; // grams
    fiber?: number; // grams
    sugar?: number; // grams
    sodium?: number; // mg
  };
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
  substitutions?: string[];
}

export interface RecipeStep {
  step: number;
  instruction: string;
  duration?: number; // minutes
  temperature?: string;
  tips?: string[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  images: string[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  instructions: RecipeStep[];
  nutrition: NutritionInfo;
  tags: string[];
  cuisine: string;
  dietaryInfo: string[];
  authorId: string;
  isPublic: boolean;
  avgRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeFilters {
  cuisine?: string;
  dietaryRestrictions?: string[];
  maxPrepTime?: number;
  maxCookTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxCalories?: number;
  minRating?: number;
  tags?: string[];
  searchQuery?: string;
}
