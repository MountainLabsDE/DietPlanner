import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMealEntryDto {
  @ApiProperty({ example: 'Greek Yogurt with Berries' })
  @IsString()
  name: string;

  @ApiProperty({ example: 250 })
  @IsInt()
  @Min(0)
  calories: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  protein: number;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(0)
  carbs: number;

  @ApiProperty({ example: 8 })
  @IsInt()
  @Min(0)
  fat: number;

  @ApiPropertyOptional({ example: '08:30' })
  @IsString()
  @IsOptional()
  time?: string;
}

export class CreateDailyTrackingDto {
  @ApiPropertyOptional({ example: '2026-05-03' })
  @IsString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: 2000 })
  @IsInt()
  @Min(0)
  caloriesTarget: number;

  @ApiPropertyOptional({ example: 120 })
  @IsInt()
  @IsOptional()
  @Min(0)
  proteinTarget?: number;

  @ApiPropertyOptional({ example: 200 })
  @IsInt()
  @IsOptional()
  @Min(0)
  carbsTarget?: number;

  @ApiPropertyOptional({ example: 70 })
  @IsInt()
  @IsOptional()
  @Min(0)
  fatTarget?: number;
}
