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
} from '@nestjs/common';
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
}
