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
    
    // PDF format - return plain text for now (real implementation would use PDF library)
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="meal-plan-${data.name || 'custom'}.txt"`);
    let text = `Meal Plan: ${data.name || 'Custom'}\n`;
    text += `Profile: ${data.profile?.name || 'N/A'}\n`;
    text += `Days: ${days.length || 0}\n\n`;
    
    days.forEach((day: any) => {
      text += `Day ${day.day}\n`;
      text += '---\n';
      const meals = Array.isArray(day.meals) ? day.meals : [];
      meals.forEach((meal: any) => {
        text += `${meal.name}\n`;
        const items = Array.isArray(meal.items) ? meal.items : [];
        items.forEach((item: any) => {
          text += `- ${item.recipe?.name || 'N/A'} (${item.calories || 0} kcal)\n`;
        });
        text += '\n';
      });
      text += '\n';
    });
    return res.send(text);
  }
}
