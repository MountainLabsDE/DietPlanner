import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AIRequest,
  AIResponse,
  AIMessage,
  MealGenerationPrompt,
  RecipeGenerationPrompt,
  MealPlanOptimizationPrompt,
  MealAnalysisPrompt,
  AIProvider,
} from '../interfaces/ai.interfaces';

@Injectable()
export class OpenAIProvider implements AIProvider {
  private readonly logger = new Logger(OpenAIProvider.name);
  private apiKey: string;
  private baseURL: string;
  private model = 'gpt-4';
  private maxTokens = 4000;
  private temperature = 0.7;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.baseURL = this.configService.get<string>('OPENAI_BASE_URL') || 'https://api.openai.com/v1';
    
    if (!this.apiKey) {
      this.logger.warn('OpenAI API key not configured');
    }
    
    const modelConfig = this.configService.get<string>('OPENAI_MODEL');
    if (modelConfig) {
      this.model = modelConfig;
    }
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new BadRequestException('OpenAI API key not configured');
    }

    const apiUrl = `${this.baseURL}/chat/completions`;
    this.logger.debug(`Calling AI API at: ${apiUrl}`);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: request.messages,
          temperature: request.temperature ?? this.temperature,
          max_tokens: request.maxTokens ?? this.maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error(`OpenAI API error: ${error}`);
        throw new BadRequestException('Failed to generate AI response');
      }

      const data = await response.json();
      
      return {
        message: data.choices[0]?.message?.content || '',
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      this.logger.error(`Error generating AI response: ${error.message}`);
      throw new BadRequestException('Failed to generate AI response');
    }
  }

  async generateMeals(prompt: MealGenerationPrompt): Promise<any> {
    const systemMessage = `You are a professional nutritionist and meal planning expert. 
Generate detailed meal plans based on user requirements.

IMPORTANT: Return ONLY valid JSON. No markdown, no extra text.

Response format:
{
  "plan": {
    "days": [
      {
        "day": 1,
        "meals": [
          {
            "name": "Breakfast",
            "time": "07:00",
            "recipes": [
              {
                "name": "Recipe Name",
                "ingredients": ["ingredient 1", "ingredient 2"],
                "instructions": ["step 1", "step 2"],
                "calories": 400,
                "protein": 30,
                "carbs": 40,
                "fat": 15,
                "servings": 1
              }
            ],
            "totalCalories": 400,
            "totalProtein": 30,
            "totalCarbs": 40,
            "totalFat": 15
          }
        ],
        "totalCalories": 2000,
        "totalProtein": 150,
        "totalCarbs": 200,
        "totalFat": 50
      }
    ]
  }
}`;

    const userMessage = `Generate a meal plan with following requirements:
- Dietary preferences: ${prompt.dietaryPreferences.join(', ')}
- Exclude ingredients: ${prompt.excludedIngredients.join(', ') || 'None'}
- Daily calorie target: ${prompt.calorieTarget} kcal
- Meals per day: ${prompt.mealsPerDay}
- Number of days: ${prompt.days}
${prompt.mealType && prompt.mealType !== 'all' ? `- Meal type focus: ${prompt.mealType}` : ''}

Ensure nutritional accuracy and variety in meals.
Return ONLY valid JSON.`;

    const response = await this.generateResponse({
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.8,
      maxTokens: 4000,
    });

    try {
      const jsonMatch = response.message.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new BadRequestException('Invalid AI response format');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.plan;
    } catch (error) {
      this.logger.error(`Error parsing AI response: ${error.message}`);
      throw new BadRequestException('Failed to parse AI response');
    }
  }

  async generateRecipe(prompt: RecipeGenerationPrompt): Promise<any> {
    const systemMessage = `You are a professional chef and nutritionist. 
Generate detailed recipes based on user requirements.

IMPORTANT: Return ONLY valid JSON. No markdown, no extra text.

Response format:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "ingredients": [
        {"item": "ingredient name", "amount": "1 cup"}
      ],
      "instructions": ["step 1", "step 2", "step 3"],
      "nutritionalInfo": {
        "calories": 450,
        "protein": 35,
        "carbs": 40,
        "fat": 18,
        "fiber": 8,
        "servings": 2
      },
      "dietaryCompatibility": {
        "vegan": true,
        "vegetarian": true,
        "glutenFree": true,
        "dairyFree": true,
        "ketoFriendly": false
      }
    }
  ]
}`;

    const userMessage = `Generate a recipe "${prompt.name}" with these requirements:
- Dietary preferences: ${prompt.dietaryPreferences.join(', ')}
- Exclude ingredients: ${prompt.excludedIngredients.join(', ') || 'None'}
- Servings: ${prompt.servings}
${prompt.maxCalories ? `- Max calories per serving: ${prompt.maxCalories}` : ''}
${prompt.preferredProteins ? `- Preferred proteins: ${prompt.preferredProteins.join(', ')}` : ''}

Return ONLY valid JSON.`;

    const response = await this.generateResponse({
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.9,
      maxTokens: 3000,
    });

    try {
      const jsonMatch = response.message.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new BadRequestException('Invalid AI response format');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (error) {
      this.logger.error(`Error parsing AI response: ${error.message}`);
      throw new BadRequestException('Failed to parse AI response');
    }
  }

  async optimizeMealPlan(prompt: MealPlanOptimizationPrompt): Promise<any> {
    const systemMessage = `You are a nutrition expert and meal plan optimizer.
Analyze and optimize meal plans to better meet nutritional goals.

IMPORTANT: Return ONLY valid JSON. No markdown, no extra text.

Response format:
{
  "optimized": true,
  "changes": [
    {
      "originalMeal": "Original meal name",
      "suggestedReplacement": "Replacement meal name",
      "reason": "Explanation of why this change improves the plan",
      "calorieDifference": -50
    }
  ],
  "newNutritionalTargets": {
    "totalCalories": 2000,
    "protein": 150,
    "carbs": 200,
    "fat": 50
  },
  "suggestions": [
    "Suggestion 1 for improvement",
    "Suggestion 2 for improvement"
  ]
}`;

    const targetInfo = [
      prompt.targets.calories ? `- Calories: ${prompt.targets.calories} kcal` : '',
      prompt.targets.protein ? `- Protein: ${prompt.targets.protein}g` : '',
      prompt.targets.carbs ? `- Carbs: ${prompt.targets.carbs}g` : '',
      prompt.targets.fat ? `- Fat: ${prompt.targets.fat}g` : '',
    ].filter(Boolean).join('\n');

    const userMessage = `Optimize this meal plan:
- Optimization goals: ${prompt.optimizationGoals.join(', ')}
- Target adjustments:
${targetInfo}

Current plan structure provided in previous context.
Return ONLY valid JSON.`;

    const response = await this.generateResponse({
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      maxTokens: 3000,
    });

    try {
      const jsonMatch = response.message.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new BadRequestException('Invalid AI response format');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (error) {
      this.logger.error(`Error parsing AI response: ${error.message}`);
      throw new BadRequestException('Failed to parse AI response');
    }
  }

  async analyzeMeal(prompt: MealAnalysisPrompt): Promise<any> {
    const systemMessage = `You are a nutrition expert. Analyze meals for dietary compliance.

IMPORTANT: Return ONLY valid JSON. No markdown, no extra text.

Response format:
{
  "suitable": true,
  "conflicts": [],
  "warnings": [],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "nutritionalEstimate": {
    "calories": 450,
    "protein": 30,
    "carbs": 40,
    "fat": 15,
    "fiber": 8
  },
  "dietaryCompatibility": {
    "vegan": true,
    "vegetarian": true,
    "glutenFree": true,
    "dairyFree": true,
    "ketoFriendly": false
  },
  "healthRating": "Excellent"
}`;

    const userMessage = `Analyze this meal:
- Meal name: ${prompt.mealName}
- Ingredients: ${prompt.ingredients.join(', ')}
- Dietary profiles to check: ${prompt.dietaryProfile.join(', ')}

Return ONLY valid JSON.`;

    const response = await this.generateResponse({
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.5,
      maxTokens: 2000,
    });

    try {
      const jsonMatch = response.message.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new BadRequestException('Invalid AI response format');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (error) {
      this.logger.error(`Error parsing AI response: ${error.message}`);
      throw new BadRequestException('Failed to parse AI response');
    }
  }
}
