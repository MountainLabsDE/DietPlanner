import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';

enum MealFrequency {
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
}

export class CreateMealPlanDto {
  @IsString()
  @Min(3)
  @Max(200)
  name: string;

  @IsString()
  profileId: string;

  @IsEnum(MealFrequency)
  mealsPerDay: MealFrequency;

  @IsInt()
  @Min(500)
  @Max(10000)
  dailyCalorieTarget: number;

  @IsArray()
  @IsString({ each: true })
  excludeIngredients?: string[];

  @IsBoolean()
  @IsOptional()
  includeSnacks?: boolean;

  @IsInt()
  @Min(1)
  @Max(28)
  numberOfDays: number;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  varietyScore?: number;
}
