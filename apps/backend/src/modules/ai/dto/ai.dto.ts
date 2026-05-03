import {
  IsString,
  IsInt,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  Max,
  MinLength,
  IsEnum,
  ArrayMinSize,
  MaxLength,
} from 'class-validator';

// ── Input DTOs ──────────────────────────────────────────────

export class GenerateMealSuggestionDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one dietary preference is required' })
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  dietaryPreferences: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @MaxLength(100, { each: true })
  excludedIngredients?: string[];

  @IsNumber()
  @Min(500, { message: 'Calorie target must be at least 500' })
  @Max(10000, { message: 'Calorie target cannot exceed 10000' })
  calorieTarget: number;

  @IsInt()
  @Min(1, { message: 'Must have at least 1 meal per day' })
  @Max(10, { message: 'Cannot exceed 10 meals per day' })
  mealsPerDay: number;

  @IsInt()
  @Min(1, { message: 'Must plan for at least 1 day' })
  @Max(30, { message: 'Cannot plan more than 30 days' })
  days: number;

  @IsEnum(['breakfast', 'lunch', 'dinner', 'snack', 'all'])
  @IsOptional()
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'all';
}

export class GenerateRecipeDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(200, { message: 'Name must be at most 200 characters' })
  name: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one dietary preference is required' })
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  dietaryPreferences: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @MaxLength(100, { each: true })
  excludedIngredients?: string[];

  @IsInt()
  @Min(1, { message: 'Must have at least 1 serving' })
  @Max(50, { message: 'Cannot exceed 50 servings' })
  servings: number;

  @IsNumber()
  @Min(0, { message: 'Max calories cannot be negative' })
  @IsOptional()
  maxCalories?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @MaxLength(100, { each: true })
  preferredProteins?: string[];
}

export class OptimizeMealPlanDto {
  @IsInt()
  @Min(1, { message: 'Plan ID must be a positive integer' })
  planId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one optimization goal is required' })
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  optimizationGoals: string[];

  @IsNumber()
  @Min(500)
  @Max(10000)
  @IsOptional()
  targetCalories?: number;

  @IsNumber()
  @Min(0)
  @Max(500)
  @IsOptional()
  targetProtein?: number;

  @IsNumber()
  @Min(0)
  @Max(500)
  @IsOptional()
  targetCarbs?: number;

  @IsNumber()
  @Min(0)
  @Max(300)
  @IsOptional()
  targetFat?: number;
}

export class AnalyzeMealDto {
  @IsString()
  @MinLength(3, { message: 'Meal name must be at least 3 characters' })
  @MaxLength(200, { message: 'Meal name must be at most 200 characters' })
  mealName: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one ingredient is required' })
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  ingredients: string[];

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one dietary profile is required' })
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  dietaryProfile: string[];
}

// ── Response DTOs (output-only, no validation decorators) ──

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
