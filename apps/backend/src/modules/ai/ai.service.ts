import { Injectable, Logger } from '@nestjs/common';
import { AIProvider } from './interfaces/ai.interfaces';
import { OpenAIProvider } from './providers/openai.provider';
import {
  GenerateMealSuggestionDto,
  GenerateRecipeDto,
  OptimizeMealPlanDto,
  AnalyzeMealDto,
} from './dto/ai.dto';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private aiProvider: AIProvider;

  constructor(private readonly openAIProvider: OpenAIProvider) {
    this.aiProvider = openAIProvider;
  }

  setAIProvider(provider: AIProvider) {
    this.aiProvider = provider;
    this.logger.log(`Switching AI provider to: ${provider.constructor.name}`);
  }

  async generateMeals(dto: GenerateMealSuggestionDto) {
    try {
      this.logger.log(`Generating meal plan: ${dto.days} days, ${dto.mealsPerDay} meals/day`);
      
      const prompt = {
        dietaryPreferences: dto.dietaryPreferences,
        excludedIngredients: dto.excludedIngredients,
        calorieTarget: dto.calorieTarget,
        mealsPerDay: dto.mealsPerDay,
        days: dto.days,
        mealType: dto.mealType,
      };

      const result = await this.aiProvider.generateMeals(prompt);
      this.logger.log(`Successfully generated meal plan with ${result.days?.length || 0} days`);
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to generate meals: ${error.message}`);
      throw error;
    }
  }

  async generateRecipe(dto: GenerateRecipeDto) {
    try {
      this.logger.log(`Generating recipe: ${dto.name}`);
      
      const prompt = {
        name: dto.name,
        dietaryPreferences: dto.dietaryPreferences,
        excludedIngredients: dto.excludedIngredients,
        servings: dto.servings,
        maxCalories: dto.maxCalories,
        preferredProteins: dto.preferredProteins,
      };

      const result = await this.aiProvider.generateRecipe(prompt);
      this.logger.log(`Successfully generated ${result.recipes?.length || 0} recipes`);
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to generate recipe: ${error.message}`);
      throw error;
    }
  }

  async optimizeMealPlan(dto: OptimizeMealPlanDto) {
    try {
      this.logger.log(`Optimizing meal plan: ${dto.planId}`);
      
      const prompt = {
        currentPlan: dto,
        optimizationGoals: dto.optimizationGoals,
        targets: {
          calories: dto.targetCalories,
          protein: dto.targetProtein,
          carbs: dto.targetCarbs,
          fat: dto.targetFat,
        },
      };

      const result = await this.aiProvider.optimizeMealPlan(prompt);
      this.logger.log(`Successfully optimized meal plan: ${result.changes?.length || 0} changes suggested`);
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to optimize meal plan: ${error.message}`);
      throw error;
    }
  }

  async analyzeMeal(dto: AnalyzeMealDto) {
    try {
      this.logger.log(`Analyzing meal: ${dto.mealName}`);
      
      const prompt = {
        mealName: dto.mealName,
        ingredients: dto.ingredients,
        dietaryProfile: dto.dietaryProfile,
      };

      const result = await this.aiProvider.analyzeMeal(prompt);
      this.logger.log(`Successfully analyzed meal. Suitable: ${result.suitable}`);
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to analyze meal: ${error.message}`);
      throw error;
    }
  }

  getAIHealthStatus() {
    return {
      status: 'operational',
      provider: this.aiProvider.constructor.name,
      configured: true,
      message: 'AI service is ready for requests',
    };
  }
}
