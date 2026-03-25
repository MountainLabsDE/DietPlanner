export interface MacroRequirements {
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  fiber?: number; // grams
}

export interface FoodPreferences {
  cuisines: string[];
  cookingTime: {
    min: number; // minutes
    max: number; // minutes
  };
  difficulty: 'easy' | 'medium' | 'hard';
  budget?: 'low' | 'medium' | 'high';
  excludedCuisines?: string[];
}

export interface DietaryRestriction {
  type: string;
  details?: Record<string, unknown>;
}

export interface DietProfile {
  id: string;
  name: string;
  type: 'predefined' | 'custom' | 'combined';
  restrictions: DietaryRestriction[];
  macros: MacroRequirements;
  preferences: FoodPreferences;
  excludedIngredients: string[];
  combinedProfileIds?: string[];
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
