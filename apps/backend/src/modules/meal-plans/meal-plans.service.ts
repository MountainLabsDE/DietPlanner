import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';

@Injectable()
export class MealPlansService {
  constructor(private prisma: PrismaService) {}

  async generate(userId: string, dto: CreateMealPlanDto) {
    const dailyCalories = dto.dailyCalorieTarget || 2000;
    const numberOfDays = dto.numberOfDays;
    const mealsPerDay = dto.mealsPerDay;
    const generatedDays = [];

    for (let day = 0; day < numberOfDays; day++) {
      const dayMeals = [];

      for (let mealNum = 0; mealNum < mealsPerDay; mealNum++) {
        const mealType = this.getMealType(mealNum, mealsPerDay);
        const targetCalories = Math.round(dailyCalories / mealsPerDay);

        const recipe = await this.findRecipeForMeal(
          targetCalories,
          dto.excludeIngredients || []
        );

        dayMeals.push({
          mealType,
          mealIndex: mealNum + 1,
          recipeId: recipe?.id || null,
          caloriesPerMeal: targetCalories,
        });
      }

      generatedDays.push({
        dayNumber: day + 1,
        meals: dayMeals,
        totalCalories: dayMeals.reduce(
          (sum, meal) => sum + meal.caloriesPerMeal,
          0
        ),
      });
    }

    return this.prisma.mealPlan.create({
      data: {
        userId,
        profileId: dto.profileId,
        name: dto.name || 'Meal Plan',
        days: generatedDays,
        config: {
          mealsPerDay,
          dailyCalorieTarget: dailyCalories,
          includeSnacks: dto.includeSnacks || false,
        },
      },
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            type: true,
            predefinedType: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const mealPlan = await this.prisma.mealPlan.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            type: true,
            predefinedType: true,
          },
        },
        meals: {
          include: {
            recipe: true,
          },
          orderBy: [
            { dayNumber: 'asc' },
            { mealType: 'asc' },
          ],
        },
      },
    });

    if (!mealPlan) {
      throw new NotFoundException(`Meal plan with ID ${id} not found`);
    }

    if (mealPlan.userId !== userId) {
      throw new NotFoundException('Meal plan not found');
    }

    return mealPlan;
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const [items, total] = await Promise.all([
      this.prisma.mealPlan.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          profile: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
        orderBy: { generatedAt: 'desc' },
      }),
      this.prisma.mealPlan.count({ where: { userId } }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async remove(id: string, userId: string) {
    const mealPlan = await this.prisma.mealPlan.findUnique({
      where: { id },
    });

    if (!mealPlan) {
      throw new NotFoundException('Meal plan not found');
    }

    if (mealPlan.userId !== userId) {
      throw new NotFoundException('Meal plan not found');
    }

    await this.prisma.mealPlan.delete({
      where: { id },
    });

    return { message: 'Meal plan deleted successfully' };
  }

  private async findRecipeForMeal(
    targetCalories: number,
    excludeIngredients: string[]
  ) {
    const recipes = await this.prisma.recipe.findMany({
      where: {
        isPublic: true,
        nutrition: {
          path: ['calories'],
          gte: Math.round(targetCalories * 0.7),
          lte: Math.round(targetCalories * 1.3),
        },
      },
      take: 1,
    });

    return recipes[0] || null;
  }

  private getMealType(mealIndex: number, totalMeals: number): string {
    const mealTypes = ['BREAKFAST', 'LUNCH', 'SNACK', 'DINNER'];
    const adjustedIndex = Math.min(mealIndex, mealTypes.length - 1);
    return mealTypes[adjustedIndex];
  }
}
