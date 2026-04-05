import { Test, TestingModule } from '@nestjs/testing';
import { AIService } from './ai.service';
import { OpenAIProvider } from './providers/openai.provider';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('AIService', () => {
  let service: AIService;
  let openAIProvider: OpenAIProvider;

  const mockOpenAIProvider = {
    generateResponse: jest.fn(),
    generateMeals: jest.fn(),
    generateRecipe: jest.fn(),
    optimizeMealPlan: jest.fn(),
    analyzeMeal: jest.fn(),
    constructor: {
      name: 'OpenAIProvider',
    },
  };

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        {
          provide: OpenAIProvider,
          useValue: mockOpenAIProvider,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AIService>(AIService);
    openAIProvider = module.get<OpenAIProvider>(OpenAIProvider);

    jest.clearAllMocks();
  });

  describe('generateMeals', () => {
    it('should generate meal plan successfully', async () => {
      const generateMealDto = {
        dietaryPreferences: ['vegan', 'gluten-free'],
        excludedIngredients: ['nuts'],
        calorieTarget: 2000,
        mealsPerDay: 4,
        days: 7,
        mealType: 'all',
      };

      const mockResponse = {
        days: [
          {
            day: 1,
            meals: [
              {
                name: 'Breakfast',
                time: '07:00',
                recipes: [
                  {
                    name: 'Oatmeal with Berries',
                    ingredients: ['oats', 'almond milk', 'blueberries'],
                    instructions: ['Cook oats with almond milk', 'Add blueberries'],
                    calories: 400,
                    protein: 15,
                    carbs: 50,
                    fat: 12,
                    servings: 1,
                  },
                ],
                totalCalories: 400,
                totalProtein: 15,
                totalCarbs: 50,
                totalFat: 12,
              },
            ],
            totalCalories: 2000,
            totalProtein: 150,
            totalCarbs: 200,
            totalFat: 50,
          },
        ],
      };

      mockOpenAIProvider.generateMeals.mockResolvedValue(mockResponse);

      const result = await service.generateMeals(generateMealDto);

      expect(result).toHaveProperty('days');
      expect(result.days).toHaveLength(1);
      expect(result.days[0]).toHaveProperty('meals');
      expect(mockOpenAIProvider.generateMeals).toHaveBeenCalledWith(
        expect.objectContaining({
          dietaryPreferences: ['vegan', 'gluten-free'],
          calorieTarget: 2000,
          days: 7,
        }),
      );
    });

    it('should throw error when provider fails', async () => {
      const generateMealDto = {
        dietaryPreferences: ['vegan'],
        excludedIngredients: [],
        calorieTarget: 2000,
        mealsPerDay: 4,
        days: 7,
        mealType: 'all',
      };

      mockOpenAIProvider.generateMeals.mockRejectedValue(
        new Error('AI API failed'),
      );

      await expect(service.generateMeals(generateMealDto)).rejects.toThrow(
        'AI API failed',
      );
    });
  });

  describe('generateRecipe', () => {
    it('should generate recipe successfully', async () => {
      const generateRecipeDto = {
        name: 'Quinoa Bowl',
        dietaryPreferences: ['vegan', 'high-protein'],
        excludedIngredients: ['soy'],
        servings: 2,
        maxCalories: 500,
        preferredProteins: ['tempeh', 'seitan'],
      };

      const mockResponse = {
        recipes: [
          {
            name: 'Quinoa Bowl',
            ingredients: [
              { item: 'quinoa', amount: '1 cup' },
              { item: 'tempeh', amount: '100g' },
            ],
            instructions: ['Cook quinoa', 'Sauté tempeh', 'Combine'],
            nutritionalInfo: {
              calories: 450,
              protein: 35,
              carbs: 40,
              fat: 18,
              fiber: 8,
              servings: 2,
            },
            dietaryCompatibility: {
              vegan: true,
              vegetarian: true,
              glutenFree: true,
              dairyFree: true,
              ketoFriendly: false,
            },
          },
        ],
      };

      mockOpenAIProvider.generateRecipe.mockResolvedValue(mockResponse);

      const result = await service.generateRecipe(generateRecipeDto);

      expect(result).toHaveProperty('recipes');
      expect(result.recipes).toHaveLength(1);
      expect(result.recipes[0].name).toBe('Quinoa Bowl');
      expect(mockOpenAIProvider.generateRecipe).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Quinoa Bowl',
          dietaryPreferences: ['vegan', 'high-protein'],
          servings: 2,
        }),
      );
    });
  });

  describe('optimizeMealPlan', () => {
    it('should optimize meal plan successfully', async () => {
      const optimizeDto = {
        planId: 1,
        optimizationGoals: ['reduce-calories', 'increase-protein'],
        targetCalories: 1800,
        targetProtein: 160,
        targetCarbs: 180,
        targetFat: 45,
      };

      const mockResponse = {
        optimized: true,
        changes: [
          {
            originalMeal: 'Chicken Pasta',
            suggestedReplacement: 'Grilled Chicken Salad',
            reason: 'Reduces calories and increases protein',
            calorieDifference: -150,
          },
        ],
        newNutritionalTargets: {
          totalCalories: 1800,
          protein: 160,
          carbs: 180,
          fat: 45,
        },
        suggestions: [
          'Reduce pasta portions',
          'Add more vegetables',
        ],
      };

      mockOpenAIProvider.optimizeMealPlan.mockResolvedValue(mockResponse);

      const result = await service.optimizeMealPlan(optimizeDto);

      expect(result).toHaveProperty('optimized', true);
      expect(result).toHaveProperty('changes');
      expect(result.changes).toHaveLength(1);
      expect(mockOpenAIProvider.optimizeMealPlan).toHaveBeenCalledWith({
        currentPlan: optimizeDto,
        optimizationGoals: ['reduce-calories', 'increase-protein'],
        targets: {
          calories: 1800,
          protein: 160,
          carbs: 180,
          fat: 45,
        },
      });
    });
  });

  describe('analyzeMeal', () => {
    it('should analyze meal successfully', async () => {
      const analyzeDto = {
        mealName: 'Mixed Berry Smoothie',
        ingredients: ['mixed berries', 'banana', 'almond milk', 'chia seeds'],
        dietaryProfile: ['vegan', 'keto'],
      };

      const mockResponse = {
        suitable: true,
        conflicts: [],
        warnings: [],
        suggestions: [
          'Add protein powder for better satiety',
          'Consider adding greens',
        ],
        nutritionalEstimate: {
          calories: 250,
          protein: 8,
          carbs: 35,
          fat: 12,
          fiber: 10,
        },
        dietaryCompatibility: {
          vegan: true,
          vegetarian: true,
          glutenFree: true,
          dairyFree: true,
          ketoFriendly: true,
        },
        healthRating: 'Excellent',
      };

      mockOpenAIProvider.analyzeMeal.mockResolvedValue(mockResponse);

      const result = await service.analyzeMeal(analyzeDto);

      expect(result).toHaveProperty('suitable', true);
      expect(result).toHaveProperty('nutritionalEstimate');
      expect(result).toHaveProperty('dietaryCompatibility');
      expect(result.dietaryCompatibility.vegan).toBe(true);
      expect(mockOpenAIProvider.analyzeMeal).toHaveBeenCalledWith({
        mealName: 'Mixed Berry Smoothie',
        ingredients: ['mixed berries', 'banana', 'almond milk', 'chia seeds'],
        dietaryProfile: ['vegan', 'keto'],
      });
    });

    it('should detect conflicts in meal', async () => {
      const analyzeDto = {
        mealName: 'Cheese Pizza',
        ingredients: ['cheese', 'wheat flour', 'tomato sauce'],
        dietaryProfile: ['vegan', 'dairy-free'],
      };

      const mockResponse = {
        suitable: false,
        conflicts: ['Contains dairy'],
        warnings: [],
        suggestions: ['Use vegan cheese alternative'],
        nutritionalEstimate: {
          calories: 300,
          protein: 12,
          carbs: 40,
          fat: 10,
          fiber: 2,
        },
        dietaryCompatibility: {
          vegan: false,
          vegetarian: true,
          glutenFree: false,
          dairyFree: false,
          ketoFriendly: false,
        },
        healthRating: 'Poor',
      };

      mockOpenAIProvider.analyzeMeal.mockResolvedValue(mockResponse);

      const result = await service.analyzeMeal(analyzeDto);

      expect(result.suitable).toBe(false);
      expect(result.conflicts).toContain('Contains dairy');
      expect(result.dietaryCompatibility.vegan).toBe(false);
    });
  });

  describe('getAIHealthStatus', () => {
    it('should return operational status', () => {
      const result = service.getAIHealthStatus();

      expect(result).toHaveProperty('status', 'operational');
      expect(result).toHaveProperty('provider');
      expect(result).toHaveProperty('configured', true);
      expect(result).toHaveProperty('message');
    });

    it('should return correct provider name', () => {
      mockOpenAIProvider.constructor.name = 'OpenAIProvider';

      const result = service.getAIHealthStatus();

      expect(result.provider).toBe('OpenAIProvider');
    });
  });

  describe('setAIProvider', () => {
    it('should switch AI provider', () => {
      const mockNewProvider = {
        generateMeals: jest.fn(),
        constructor: {
          name: 'AnthropicProvider',
        },
      };

      service.setAIProvider(mockNewProvider as any);

      const result = service.getAIHealthStatus();

      expect(result.provider).toBe('AnthropicProvider');
    });
  });
});
