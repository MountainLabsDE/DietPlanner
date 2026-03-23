# AI Module

## Overview
AI-powered meal planning, recipe generation, and nutrition analysis features for PlatePulse.

## Features

### 1. AI Meal Plan Generation
Generate personalized meal plans based on:
- Dietary preferences (vegan, keto, vegetarian, etc.)
- Excluded ingredients
- Daily calorie targets
- Number of meals per day
- Number of days
- Meal type focus (breakfast, lunch, dinner, snack, or all)

### 2. AI Recipe Generation
Create custom recipes with:
- Recipe name or concept
- Dietary preferences
- Excluded ingredients
- Servings
- Max calories per serving
- Preferred proteins

### 3. Meal Plan Optimization
Optimize existing meal plans for:
- Calorie targets
- Macro targets (protein, carbs, fat)
- Nutritional balance
- Variety improvements

### 4. Meal Analysis
Analyze meals for:
- Dietary compliance
- Nutritional estimates
- Dietary compatibility flags
- Health rating
- Conflict detection
- Improvement suggestions

## Architecture

### Provider Pattern
The module uses a provider pattern to support multiple AI providers:
- **OpenAI Provider** (Implemented)
  - Model: GPT-4 (configurable)
  - Max tokens: 4000
  - Temperature: 0.7 (configurable)

### Files Structure
```
ai/
├── dto/
│   └── ai.dto.ts          # DTOs for all AI endpoints
├── interfaces/
│   └── ai.interfaces.ts    # AI provider interfaces
├── providers/
│   └── openai.provider.ts  # OpenAI implementation
├── ai.controller.ts         # API endpoints
├── ai.service.ts           # Business logic
└── ai.module.ts            # Module configuration
```

## API Endpoints

### POST /api/ai/generate-meals
Generate AI-powered meal plan.

**Body:**
```json
{
  "dietaryPreferences": ["vegan", "gluten-free"],
  "excludedIngredients": ["nuts", "shellfish"],
  "calorieTarget": 2000,
  "mealsPerDay": 4,
  "days": 7,
  "mealType": "all"
}
```

**Response:**
```json
{
  "plan": {
    "days": [...]
  }
}
```

### POST /api/ai/generate-recipe
Generate AI-powered recipe.

**Body:**
```json
{
  "name": "Quinoa Bowl",
  "dietaryPreferences": ["vegan", "high-protein"],
  "excludedIngredients": ["soy"],
  "servings": 2,
  "maxCalories": 500,
  "preferredProteins": ["tempeh", "seitan"]
}
```

**Response:**
```json
{
  "recipes": [...]
}
```

### POST /api/ai/optimize-meal-plan
Optimize existing meal plan with AI.

**Body:**
```json
{
  "planId": 123,
  "optimizationGoals": ["reduce-calories", "increase-protein"],
  "targetCalories": 1800,
  "targetProtein": 160,
  "targetCarbs": 180,
  "targetFat": 45
}
```

**Response:**
```json
{
  "optimized": true,
  "changes": [...],
  "newNutritionalTargets": {...},
  "suggestions": [...]
}
```

### POST /api/ai/analyze-meal
Analyze meal for dietary compatibility.

**Body:**
```json
{
  "mealName": "Mixed Berry Smoothie",
  "ingredients": ["mixed berries", "banana", "almond milk", "chia seeds"],
  "dietaryProfile": ["vegan", "keto"]
}
```

**Response:**
```json
{
  "suitable": true,
  "conflicts": [],
  "warnings": [],
  "suggestions": [...],
  "nutritionalEstimate": {...},
  "dietaryCompatibility": {
    "vegan": true,
    "vegetarian": true,
    "glutenFree": true,
    "dairyFree": true,
    "ketoFriendly": true
  },
  "healthRating": "Excellent"
}
```

### GET /api/ai/health
Check AI service health status.

**Response:**
```json
{
  "status": "operational",
  "provider": "OpenAIProvider",
  "configured": true,
  "message": "AI service is ready for requests"
}
```

## Configuration

### Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
```

### .env.example
```env
# AI Configuration
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4
```

## Implementation Details

### OpenAI Provider
- Uses OpenAI Chat Completions API
- Implements AIProvider interface
- Provides 4 main methods:
  1. `generateResponse()` - Generic AI chat response
  2. `generateMeals()` - Meal plan generation
  3. `generateRecipe()` - Recipe generation
  4. `optimizeMealPlan()` - Plan optimization
  5. `analyzeMeal()` - Meal analysis

### JSON Parsing
All AI responses are validated JSON with strict formatting:
- System prompts enforce JSON-only responses
- Regex extraction of JSON from response
- Error handling for invalid formats
- Fallback handling for parsing failures

### Error Handling
- `BadRequestException` for: 
  - Missing API key
  - API errors
  - Invalid response formats
  - Parsing failures
- Comprehensive logging for debugging

## Usage

### In Services

```typescript
import { AIService } from './ai/ai.module';

const result = await this.aiService.generateMeals({
  dietaryPreferences: ['vegan'],
  excludedIngredients: [],
  calorieTarget: 2000,
  mealsPerDay: 4,
  days: 7,
});
```

### From Frontend

```typescript
const response = await fetch('/api/ai/generate-meals', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    dietaryPreferences: ['vegan'],
    calorieTarget: 2000,
    mealsPerDay: 4,
    days: 7,
  }),
});

const data = await response.json();
```

## Extensibility

### Adding New AI Providers

To add a new AI provider (e.g., Anthropic):

1. Create new provider in `ai/providers/`:
```typescript
@Injectable()
export class AnthropicProvider implements AIProvider {
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    // Implementation
  }
  // ... other methods
}
```

2. Add provider to `ai.module.ts`:
```typescript
providers: [AIService, AnthropicProvider],
```

3. Switch providers in `ai.service.ts`:
```typescript
constructor(private readonly anthropicProvider: AnthropicProvider) {
  this.aiProvider = anthropicProvider;
}
```

### Adding New AI Features

To add new AI capability:

1. Add DTO in `ai/dto/ai.dto.ts`
2. Add method to `AIProvider` interface
3. Implement in `openai.provider.ts`
4. Add endpoint in `ai.controller.ts`
5. Add business logic in `ai.service.ts`

## Testing

### Manual Testing
1. Ensure `OPENAI_API_KEY` is set in `.env`
2. Test health endpoint: `GET /api/ai/health`
3. Test meal generation with sample data
4. Test recipe generation
5. Test optimization
6. Test meal analysis

### API Key Setup
Get OpenAI API key from: https://platform.openai.com/api-keys

## Considerations

### Costs
- OpenAI API charges per token usage
- GPT-4: Input tokens ~$0.03/1K, Output tokens ~$0.06/1K
- Implement rate limiting and caching in production

### Performance
- AI requests are async and non-blocking
- Implement retry logic for failed requests
- Cache common meal plans
- Use streaming responses for faster UI

### Security
- API keys should never be committed to git
- Add `.env` to `.gitignore`
- Use environment variables for credentials
- Validate user input before sending to AI

## Future Enhancements

1. **Multi-Provider Support**
   - Allow user to choose AI provider
   - Add Anthropic Claude support
   - Add Google Gemini support

2. **MCP (Model Context Protocol)**
   - Advanced context management
   - Multi-model integration
   - Plugin system for extensions

3. **Streaming Responses**
   - Real-time generation
   - Better user experience
   - Token-by-token streaming

4. **Prompt Templates**
   - Store common prompts
   - Allow customization
   - A/B testing for effectiveness

5. **Rate Limiting & Caching**
   - Control costs
   - Improve response time
   - Store common generations

6. **Analytics**
   - Track AI usage
   - Monitor costs
   - Improve prompts based on feedback
