import { IsEnum, IsOptional, IsString, IsArray, Min, Max, IsBoolean } from 'class-validator';

export enum DietProfileType {
  PREDEFINED = 'PREDEFINED',
  CUSTOM = 'CUSTOM',
  COMBINED = 'COMBINED',
}

export enum PredefinedDiet {
  VEGAN = 'VEGAN',
  VEGETARIAN = 'VEGETARIAN',
  KETO = 'KETO',
  PALEO = 'PALEO',
  MEDITERRANEAN = 'MEDITERRANEAN',
  LOW_CARB = 'LOW_CARB',
  HIGH_PROTEIN = 'HIGH_PROTEIN',
  GLUTEN_FREE = 'GLUTEN_FREE',
  DAIRY_FREE = 'DAIRY_FREE',
  RAW = 'RAW',
}

export class CreateDietProfileDto {
  @IsEnum(DietProfileType)
  type: DietProfileType;

  @IsString()
  @Min(3, { message: 'Name must be at least 3 characters' })
  @Max(100, { message: 'Name must be at most 100 characters' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  restrictions?: string[];

  @IsEnum(PredefinedDiet)
  @IsOptional()
  predefinedType?: PredefinedDiet;

  @Min(1)
  @Max(10000)
  @IsOptional()
  dailyCalorieTarget?: number;

  @Min(0)
  @Max(100)
  @IsOptional()
  proteinPercentage?: number;

  @Min(0)
  @Max(100)
  @IsOptional()
  carbsPercentage?: number;

  @Min(0)
  @Max(100)
  @IsOptional()
  fatPercentage?: number;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;
}
