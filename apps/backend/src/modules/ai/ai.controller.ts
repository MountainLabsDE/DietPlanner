import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AIService } from './ai.service';
import {
  GenerateMealSuggestionDto,
  GenerateRecipeDto,
  OptimizeMealPlanDto,
  AnalyzeMealDto,
} from './dto/ai.dto';

@ApiTags('AI Features')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('generate-meals')
  @ApiOperation({ summary: 'Generate AI-powered meal plan' })
  @ApiBearerAuth()
  async generateMeals(@Body() dto: GenerateMealSuggestionDto, @Request() req) {
    return this.aiService.generateMeals(dto);
  }

  @Post('generate-recipe')
  @ApiOperation({ summary: 'Generate AI-powered recipe' })
  @ApiBearerAuth()
  async generateRecipe(@Body() dto: GenerateRecipeDto, @Request() req) {
    return this.aiService.generateRecipe(dto);
  }

  @Post('optimize-meal-plan')
  @ApiOperation({ summary: 'Optimize existing meal plan with AI' })
  @ApiBearerAuth()
  async optimizeMealPlan(@Body() dto: OptimizeMealPlanDto, @Request() req) {
    return this.aiService.optimizeMealPlan(dto);
  }

  @Post('analyze-meal')
  @ApiOperation({ summary: 'Analyze meal for dietary compatibility' })
  @ApiBearerAuth()
  async analyzeMeal(@Body() dto: AnalyzeMealDto, @Request() req) {
    return this.aiService.analyzeMeal(dto);
  }

  @Get('health')
  @ApiOperation({ summary: 'Check AI service health' })
  async getHealth() {
    return this.aiService.getAIHealthStatus();
  }
}
