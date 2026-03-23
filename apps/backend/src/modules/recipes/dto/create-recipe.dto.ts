import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  Min,
  Max,
  IsEnum,
  ArrayMinSize,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
}

class NutritionInfoDto {
  @IsInt()
  @Min(0)
  calories: number;

  @IsInt()
  @Min(0)
  protein: number;

  @IsInt()
  @Min(0)
  carbs: number;

  @IsInt()
  @Min(0)
  fat: number;

  @IsInt()
  @Min(0)
  fiber?: number;

  @IsInt()
  @Min(0)
  sugar?: number;

  @IsInt()
  @Min(0)
  sodium?: number;
}

class IngredientDto {
  @IsString()
  name: string;

  @IsString()
  amount?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

class PreparationStepDto {
  @IsString()
  @Min(1)
  stepNumber: number;

  @IsString()
  instruction: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  durationMinutes?: number;
}

export class CreateRecipeDto {
  @IsString()
  @Min(3, { message: 'Name must be at least 3 characters' })
  @Max(200, { message: 'Name must be at most 200 characters' })
  name: string;

  @IsString()
  @IsOptional()
  @Max(1000)
  description?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one image is required' })
  @IsString({ each: true })
  images: string[];

  @ValidateNested()
  @Type(() => NutritionInfoDto)
  nutrition: NutritionInfoDto;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one ingredient is required' })
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one preparation step is required' })
  @ValidateNested({ each: true })
  @Type(() => PreparationStepDto)
  preparationSteps: PreparationStepDto[];

  @IsInt()
  @Min(5, { message: 'Preparation time must be at least 5 minutes' })
  @Max(1440, { message: 'Preparation time cannot exceed 24 hours' })
  prepTimeMinutes: number;

  @IsInt()
  @Min(0, { message: 'Cooking time cannot be negative' })
  @Max(1440, { message: 'Cooking time cannot exceed 24 hours' })
  cookTimeMinutes?: number;

  @IsInt()
  @Min(1)
  @Max(100)
  servings: number;

  @IsEnum(MealType)
  @IsOptional()
  mealType?: MealType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  restrictions?: string[];

  @IsInt()
  @Min(1)
  @Max(5)
  difficultyLevel?: number;
}
