import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateDailyTrackingDto, CreateMealEntryDto } from './dto/create-meal-entry.dto';

interface MealEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  private computeMacrosFromMeals(meals: MealEntry[]): Macros {
    return meals.reduce(
      (acc, m) => ({
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 },
    );
  }

  private computeCaloriesFromMeals(meals: MealEntry[]): number {
    return meals.reduce((sum, m) => sum + m.calories, 0);
  }

  async getTodayTracking(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let tracking = await this.prisma.dailyTracking.findFirst({
      where: {
        userId,
        date: { gte: today, lt: tomorrow },
      },
    });

    // If no tracking for today, return empty state with defaults
    if (!tracking) {
      return {
        id: null,
        date: today.toISOString().split('T')[0],
        caloriesConsumed: 0,
        caloriesTarget: 2000,
        macrosConsumed: { protein: 0, carbs: 0, fat: 0 },
        macrosTarget: { protein: 120, carbs: 200, fat: 70 },
        meals: [],
      };
    }

    return {
      id: tracking.id,
      date: tracking.date.toISOString().split('T')[0],
      caloriesConsumed: tracking.caloriesConsumed,
      caloriesTarget: tracking.caloriesTarget,
      macrosConsumed: tracking.macrosConsumed as Macros,
      macrosTarget: tracking.macrosTarget as Macros,
      meals: tracking.meals as MealEntry[],
    };
  }

  async getTrackingByDate(userId: string, date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    let tracking = await this.prisma.dailyTracking.findFirst({
      where: {
        userId,
        date: { gte: start, lt: end },
      },
    });

    if (!tracking) {
      return {
        id: null,
        date,
        caloriesConsumed: 0,
        caloriesTarget: 2000,
        macrosConsumed: { protein: 0, carbs: 0, fat: 0 },
        macrosTarget: { protein: 120, carbs: 200, fat: 70 },
        meals: [],
      };
    }

    return {
      id: tracking.id,
      date: tracking.date.toISOString().split('T')[0],
      caloriesConsumed: tracking.caloriesConsumed,
      caloriesTarget: tracking.caloriesTarget,
      macrosConsumed: tracking.macrosConsumed as Macros,
      macrosTarget: tracking.macrosTarget as Macros,
      meals: tracking.meals as MealEntry[],
    };
  }

  async initTracking(userId: string, dto: CreateDailyTrackingDto) {
    const date = dto.date ? new Date(dto.date) : new Date();
    date.setHours(0, 0, 0, 0);

    // Check if tracking already exists for this date
    const existing = await this.prisma.dailyTracking.findFirst({
      where: {
        userId,
        date: { gte: date, lt: new Date(date.getTime() + 86400000) },
      },
    });

    if (existing) {
      return {
        id: existing.id,
        date: existing.date.toISOString().split('T')[0],
        caloriesConsumed: existing.caloriesConsumed,
        caloriesTarget: existing.caloriesTarget,
        macrosConsumed: existing.macrosConsumed as Macros,
        macrosTarget: existing.macrosTarget as Macros,
        meals: existing.meals as MealEntry[],
      };
    }

    const macrosTarget: Macros = {
      protein: dto.proteinTarget ?? 120,
      carbs: dto.carbsTarget ?? 200,
      fat: dto.fatTarget ?? 70,
    };

    const tracking = await this.prisma.dailyTracking.create({
      data: {
        userId,
        date,
        caloriesTarget: dto.caloriesTarget,
        macrosTarget,
        meals: [],
        macrosConsumed: { protein: 0, carbs: 0, fat: 0 },
      },
    });

    return {
      id: tracking.id,
      date: tracking.date.toISOString().split('T')[0],
      caloriesConsumed: tracking.caloriesConsumed,
      caloriesTarget: tracking.caloriesTarget,
      macrosConsumed: tracking.macrosConsumed as Macros,
      macrosTarget: tracking.macrosTarget as Macros,
      meals: tracking.meals as MealEntry[],
    };
  }

  async addMeal(userId: string, dto: CreateMealEntryDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let tracking = await this.prisma.dailyTracking.findFirst({
      where: {
        userId,
        date: { gte: today, lt: tomorrow },
      },
    });

    // Auto-create tracking for today if none exists
    if (!tracking) {
      tracking = await this.prisma.dailyTracking.create({
        data: {
          userId,
          date: today,
          caloriesTarget: 2000,
          macrosTarget: { protein: 120, carbs: 200, fat: 70 },
          meals: [],
          macrosConsumed: { protein: 0, carbs: 0, fat: 0 },
        },
      });
    }

    const meals = (tracking.meals as MealEntry[]) || [];
    const meal: MealEntry = {
      id: Math.random().toString(36).substring(2, 15),
      name: dto.name,
      calories: dto.calories,
      protein: dto.protein,
      carbs: dto.carbs,
      fat: dto.fat,
      time: dto.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    meals.push(meal);

    const updatedTracking = await this.prisma.dailyTracking.update({
      where: { id: tracking.id },
      data: {
        meals,
        caloriesConsumed: this.computeCaloriesFromMeals(meals),
        macrosConsumed: this.computeMacrosFromMeals(meals),
      },
    });

    return {
      id: updatedTracking.id,
      date: updatedTracking.date.toISOString().split('T')[0],
      caloriesConsumed: updatedTracking.caloriesConsumed,
      caloriesTarget: updatedTracking.caloriesTarget,
      macrosConsumed: updatedTracking.macrosConsumed as Macros,
      macrosTarget: updatedTracking.macrosTarget as Macros,
      meals: updatedTracking.meals as MealEntry[],
    };
  }

  async deleteMeal(userId: string, mealId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tracking = await this.prisma.dailyTracking.findFirst({
      where: {
        userId,
        date: { gte: today, lt: tomorrow },
      },
    });

    if (!tracking) {
      throw new NotFoundException('No tracking found for today');
    }

    const meals = (tracking.meals as MealEntry[]) || [];
    const mealIndex = meals.findIndex((m) => m.id === mealId);

    if (mealIndex === -1) {
      throw new NotFoundException('Meal not found');
    }

    meals.splice(mealIndex, 1);

    const updatedTracking = await this.prisma.dailyTracking.update({
      where: { id: tracking.id },
      data: {
        meals,
        caloriesConsumed: this.computeCaloriesFromMeals(meals),
        macrosConsumed: this.computeMacrosFromMeals(meals),
      },
    });

    return {
      id: updatedTracking.id,
      date: updatedTracking.date.toISOString().split('T')[0],
      caloriesConsumed: updatedTracking.caloriesConsumed,
      caloriesTarget: updatedTracking.caloriesTarget,
      macrosConsumed: updatedTracking.macrosConsumed as Macros,
      macrosTarget: updatedTracking.macrosTarget as Macros,
      meals: updatedTracking.meals as MealEntry[],
    };
  }

  async getTrackingHistory(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const records = await this.prisma.dailyTracking.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
      orderBy: { date: 'desc' },
    });

    return records.map((r) => ({
      id: r.id,
      date: r.date.toISOString().split('T')[0],
      caloriesConsumed: r.caloriesConsumed,
      caloriesTarget: r.caloriesTarget,
      macrosConsumed: r.macrosConsumed as Macros,
      macrosTarget: r.macrosTarget as Macros,
      waterMl: r.waterMl,
      weightKg: r.weightKg ? parseFloat(r.weightKg.toString()) : null,
    }));
  }
}
