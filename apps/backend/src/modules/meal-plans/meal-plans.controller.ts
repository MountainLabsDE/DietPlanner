import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Res,
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MealPlansService } from './meal-plans.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('meal-plans')
@Controller('meal-plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new meal plan' })
  @ApiResponse({ status: 201, description: 'Meal plan generated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  generate(@Request() req, @Body() dto: CreateMealPlanDto) {
    return this.mealPlansService.generate(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user meal plans' })
  @ApiResponse({ status: 200, description: 'Meal plans retrieved' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.mealPlansService.findAll(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a meal plan by ID' })
  @ApiResponse({ status: 200, description: 'Meal plan found' })
  @ApiResponse({ status: 404, description: 'Meal plan not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.mealPlansService.findOne(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meal plan' })
  @ApiResponse({ status: 200, description: 'Meal plan deleted' })
  @ApiResponse({ status: 404, description: 'Meal plan not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.mealPlansService.remove(id, req.user.id);
  }

  @Get(':id/export')
  @ApiOperation({ summary: 'Export meal plan' })
  @ApiResponse({ status: 200, description: 'Meal plan exported' })
  @ApiQuery({ name: 'format', required: true, enum: ['pdf', 'csv', 'json'] })
  @Header('Content-Type', 'application/octet-stream')
  async export(
    @Param('id') id: string,
    @Query('format') format: string,
    @Request() req,
    @Res() res: Response
  ) {
    const data: any = await this.mealPlansService.findOne(id, req.user.id);
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="meal-plan-${data.name || 'custom'}.json"`);
      return res.json(data);
    }
    
    const days = Array.isArray(data.days) ? data.days : [];
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="meal-plan-${data.name || 'custom'}.csv"`);
      
      let csv = 'Day,Meal,Recipe,Calories,Protein(g),Carbs(g),Fat(g)\n';
      days.forEach((day: any) => {
        const meals = Array.isArray(day.meals) ? day.meals : [];
        meals.forEach((meal: any) => {
          const items = Array.isArray(meal.items) ? meal.items : [];
          items.forEach((item: any) => {
            csv += `${day.day},${meal.name},${item.recipe?.name || 'N/A'},${item.calories || 0},${item.protein || 0},${item.carbs || 0},${item.fat || 0}\n`;
          });
        });
      });
      return res.send(csv);
    }
    
    const pdfStructure = {
      type: 'pdf-structure',
      plan: {
        name: data.name || 'Custom Plan',
        createdAt: data.createdAt,
        profile: data.profile?.name || 'N/A',
        profileType: data.profile?.predefinedType || 'Custom',
        daysCount: days.length,
      },
      summary: {
        totalMeals: days.reduce((sum: number, day: any) => {
          const dayMeals = Array.isArray(day.meals) ? day.meals : [];
          return sum + dayMeals.length;
        }, 0),
        totalRecipes: days.reduce((sum: number, day: any) => {
          const dayMeals = Array.isArray(day.meals) ? day.meals : [];
          const recipesPerMeal = dayMeals.reduce((mSum: number, meal: any) => {
            const items = Array.isArray(meal.items) ? meal.items : [];
            return mSum + items.length;
          }, 0);
          return sum + recipesPerMeal;
        }, 0),
        totalCalories: days.reduce((sum: number, day: any) => {
          const dayMeals = Array.isArray(day.meals) ? day.meals : [];
          return sum + dayMeals.reduce((mSum: number, meal: any) => {
            const items = Array.isArray(meal.items) ? meal.items : [];
            return mSum + items.reduce((iSum: number, item: any) => iSum + (item.calories || 0), 0);
          }, 0);
        }, 0),
        totalProtein: days.reduce((sum: number, day: any) => {
          const dayMeals = Array.isArray(day.meals) ? day.meals : [];
          return sum + dayMeals.reduce((mSum: number, meal: any) => {
            const items = Array.isArray(meal.items) ? meal.items : [];
            return mSum + items.reduce((iSum: number, item: any) => iSum + (item.protein || 0), 0);
          }, 0);
        }, 0),
        totalCarbs: days.reduce((sum: number, day: any) => {
          const dayMeals = Array.isArray(day.meals) ? day.meals : [];
          return sum + dayMeals.reduce((mSum: number, meal: any) => {
            const items = Array.isArray(meal.items) ? meal.items : [];
            return mSum + items.reduce((iSum: number, item: any) => iSum + (item.carbs || 0), 0);
          }, 0);
        }, 0),
        totalFat: days.reduce((sum: number, day: any) => {
          const dayMeals = Array.isArray(day.meals) ? day.meals : [];
          return sum + dayMeals.reduce((mSum: number, meal: any) => {
            const items = Array.isArray(meal.items) ? meal.items : [];
            return mSum + items.reduce((iSum: number, item: any) => iSum + (item.fat || 0), 0);
          }, 0);
        }, 0),
      },
      days: days.map((day: any) => {
        const dayMeals = Array.isArray(day.meals) ? day.meals : [];
        return {
          day: day.day,
          meals: dayMeals.map((meal: any) => {
            const items = Array.isArray(meal.items) ? meal.items : [];
            return {
              name: meal.name,
              time: meal.time || 'N/A',
              recipes: items.map((item: any) => ({
                name: item.recipe?.name || 'N/A',
                calories: item.calories || 0,
                protein: item.protein || 0,
                carbs: item.carbs || 0,
                fat: item.fat || 0,
              })),
              dayCalories: items.reduce((sum: number, item: any) => sum + (item.calories || 0), 0),
              dayProtein: items.reduce((sum: number, item: any) => sum + (item.protein || 0), 0),
              dayCarbs: items.reduce((sum: number, item: any) => sum + (item.carbs || 0), 0),
              dayFat: items.reduce((sum: number, item: any) => sum + (item.fat || 0), 0),
            };
          }),
        dayCalories: dayMeals.reduce((sum: number, meal: any) => {
            const items = Array.isArray(meal.items) ? meal.items : [];
            return sum + items.reduce((iSum: number, item: any) => iSum + (item.calories || 0), 0);
          }, 0),
          dayProtein: dayMeals.reduce((sum: number, meal: any) => {
            const items = Array.isArray(meal.items) ? meal.items : [];
            return sum + items.reduce((iSum: number, item: any) => iSum + (item.protein || 0), 0);
          }, 0),
          dayCarbs: dayMeals.reduce((sum: number, meal: any) => {
            const items = Array.isArray(meal.items) ? meal.items : [];
            return sum + items.reduce((iSum: number, item: any) => iSum + (item.carbs || 0), 0);
          }, 0),
          dayFat: dayMeals.reduce((sum: number, meal: any) => {
            const items = Array.isArray(meal.items) ? meal.items : [];
            return sum + items.reduce((iSum: number, item: any) => iSum + (item.fat || 0), 0);
          }, 0),
        };
      }),
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="meal-plan-${data.name || 'custom'}.pdf"`);
    return res.json(pdfStructure);
  }
}
