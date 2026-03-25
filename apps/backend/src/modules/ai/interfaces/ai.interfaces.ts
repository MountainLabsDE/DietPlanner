export interface AIConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  message: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface MealGenerationPrompt {
  dietaryPreferences: string[];
  excludedIngredients: string[];
  calorieTarget: number;
  mealsPerDay: number;
  days: number;
  mealType?: string;
}

export interface RecipeGenerationPrompt {
  name: string;
  dietaryPreferences: string[];
  excludedIngredients: string[];
  servings: number;
  maxCalories?: number;
  preferredProteins?: string[];
}

export interface MealPlanOptimizationPrompt {
  currentPlan: any;
  optimizationGoals: string[];
  targets: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface MealAnalysisPrompt {
  mealName: string;
  ingredients: string[];
  dietaryProfile: string[];
}

export interface AIProvider {
  generateResponse(request: AIRequest): Promise<AIResponse>;
  generateMeals(prompt: MealGenerationPrompt): Promise<any>;
  generateRecipe(prompt: RecipeGenerationPrompt): Promise<any>;
  optimizeMealPlan(prompt: MealPlanOptimizationPrompt): Promise<any>;
  analyzeMeal(prompt: MealAnalysisPrompt): Promise<any>;
}
