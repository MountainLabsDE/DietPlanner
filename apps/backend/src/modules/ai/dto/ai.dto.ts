export class GenerateMealSuggestionDto {
  dietaryPreferences: string[];
  excludedIngredients: string[];
  calorieTarget: number;
  mealsPerDay: number;
  days: number;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'all';
}

export class GenerateRecipeDto {
  name: string;
  dietaryPreferences: string[];
  excludedIngredients: string[];
  servings: number;
  maxCalories?: number;
  preferredProteins?: string[];
}

export class OptimizeMealPlanDto {
  planId: number;
  optimizationGoals: string[];
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
}

export class AnalyzeMealDto {
  mealName: string;
  ingredients: string[];
  dietaryProfile: string[];
}
 
export class MealSuggestionResponseDto {
  mealName: string;
  recipes: Array<{
    name: string;
    ingredients: string[];
    instructions: string[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servings: number;
  }>;
  nutritionalInfo: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  };
}

export class RecipeGenerationResponseDto {
  recipes: Array<{
    name: string;
    ingredients: Array<{
      item: string;
      amount: string;
    }>;
    instructions: string[];
    nutritionalInfo: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      servings: number;
    };
    dietaryCompatibility: {
      vegan: boolean;
      vegetarian: boolean;
      glutenFree: boolean;
      dairyFree: boolean;
      ketoFriendly: boolean;
    };
  }>;
}

export class OptimizationResponseDto {
  optimized: boolean;
  changes: Array<{
    originalMeal: string;
    suggestedReplacement: string;
    reason: string;
    calorieDifference: number;
  }>;
  newNutritionalTargets: {
    totalCalories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  suggestions: string[];
}
