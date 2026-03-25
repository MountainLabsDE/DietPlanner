'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { Navbar } from '@/components/navbar';
import { api } from '@/lib/api';

export default function AIFeaturesPage() {
  const [activeTab, setActiveTab] = useState<'meals' | 'recipe' | 'optimize' | 'analyze'>('meals');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // Meal Generation Form
  const [mealForm, setMealForm] = useState({
    dietaryPreferences: [] as string[],
    excludedIngredients: [] as string[],
    calorieTarget: 2000,
    mealsPerDay: 4,
    days: 7,
    mealType: 'all' as 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'all',
  });

  // Recipe Generation Form
  const [recipeForm, setRecipeForm] = useState({
    name: '',
    dietaryPreferences: [] as string[],
    excludedIngredients: [] as string[],
    servings: 2,
    maxCalories: 500,
    preferredProteins: [] as string[],
  });

  // Optimization Form
  const [optimizeForm, setOptimizeForm] = useState({
    planId: '',
    optimizationGoals: [] as string[],
    targetCalories: '',
    targetProtein: '',
    targetCarbs: '',
    targetFat: '',
  });

  // Analysis Form
  const [analyzeForm, setAnalyzeForm] = useState({
    mealName: '',
    ingredients: [] as string[],
    dietaryProfile: [] as string[],
  });

  const dietOptions = ['vegan', 'vegetarian', 'keto', 'paleo', 'mediterranean', 'gluten-free', 'dairy-free', 'low-carb', 'high-protein', 'balanced'];
  const optimizationGoalOptions = ['reduce-calories', 'increase-protein', 'reduce-carbs', 'increase-fiber', 'improve-variety', 'optimize-budget'];
  const proteinOptions = ['chicken', 'beef', 'fish', 'tofu', 'tempeh', 'seitan', 'eggs', 'beans', 'lentils'];

  const toggleArrayItem = (setter: Function) => (item: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = setter(e.target.value);
    const newValue = value.includes(item)
      ? value.filter((v: string) => v !== item)
      : [...value, item];
    setter(newValue);
  };

  const handleGenerateMeals = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await api.generateAIMeals(mealForm);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to generate meals');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await api.generateAIRecipe(recipeForm);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to generate recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizePlan = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const data = {
        ...optimizeForm,
        planId: parseInt(optimizeForm.planId) || 0,
        targetCalories: optimizeForm.targetCalories ? parseInt(optimizeForm.targetCalories) : undefined,
        targetProtein: optimizeForm.targetProtein ? parseInt(optimizeForm.targetProtein) : undefined,
        targetCarbs: optimizeForm.targetCarbs ? parseInt(optimizeForm.targetCarbs) : undefined,
        targetFat: optimizeForm.targetFat ? parseInt(optimizeForm.targetFat) : undefined,
      };

      const response = await api.optimizeAIMealPlan(data);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to optimize meal plan');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeMeal = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await api.analyzeAIMeal(analyzeForm);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze meal');
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => {
    const input = prompt('Enter an ingredient to exclude:');
    if (input && input.trim()) {
      setMealForm({ ...mealForm, excludedIngredients: [...mealForm.excludedIngredients, input.trim()] });
    }
  };

  const removeIngredient = (index: number) => {
    setMealForm({
      ...mealForm,
      excludedIngredients: mealForm.excludedIngredients.filter((_, i) => i !== index),
    });
  };

  const addAnalyzeIngredient = () => {
    const input = prompt('Enter an ingredient:');
    if (input && input.trim()) {
      setAnalyzeForm({ ...analyzeForm, ingredients: [...analyzeForm.ingredients, input.trim()] });
    }
  };

  const removeAnalyzeIngredient = (index: number) => {
    setAnalyzeForm({
      ...analyzeForm,
      ingredients: analyzeForm.ingredients.filter((_, i) => i !== index),
    });
  };

  const tabs = [
    { id: 'meals' as const, label: 'Generate Meals', icon: '🍽️' },
    { id: 'recipe' as const, label: 'Generate Recipe', icon: '👨‍🍳' },
    { id: 'optimize' as const, label: 'Optimize Plan', icon: '⚡' },
    { id: 'analyze' as const, label: 'Analyze Meal', icon: '🔍' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              AI Features
            </h1>
            <p className="text-xl text-gray-600">
              Powered meal planning, recipe generation, and nutrition analysis
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl">
                  {error}
                </div>
              )}

              {activeTab === 'meals' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Generate AI-Powered Meal Plan</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
                      <div className="grid grid-cols-2 gap-2">
                        {dietOptions.map((diet) => (
                          <label key={diet} className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300">
                            <input
                              type="checkbox"
                              checked={mealForm.dietaryPreferences.includes(diet)}
                              onChange={toggleArrayItem(setMealForm)(diet)}
                              className="w-4 h-4 text-purple-600"
                            />
                            <span className="text-sm text-gray-700 capitalize">{diet}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Excluded Ingredients</label>
                      <div className="space-y-2 mb-3">
                        {mealForm.excludedIngredients.map((ingredient, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="flex-1 px-3 py-2 bg-red-50 border-2 border-red-200 rounded-lg text-sm">
                              {ingredient}
                            </span>
                            <button
                              onClick={() => removeIngredient(index)}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={addIngredient}
                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-purple-400"
                      >
                        + Add Exclusion
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Calorie Target</label>
                      <input
                        type="number"
                        value={mealForm.calorieTarget}
                        onChange={(e) => setMealForm({ ...mealForm, calorieTarget: parseInt(e.target.value) || 2000 })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meals Per Day</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={mealForm.mealsPerDay}
                        onChange={(e) => setMealForm({ ...mealForm, mealsPerDay: parseInt(e.target.value) || 4 })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={mealForm.days}
                        onChange={(e) => setMealForm({ ...mealForm, days: parseInt(e.target.value) || 7 })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type Focus</label>
                    <div className="grid grid-cols-5 gap-2">
                      {(['all', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setMealForm({ ...mealForm, mealType: type })}
                          className={`px-4 py-2 border-2 rounded-lg transition-all ${
                            mealForm.mealType === type
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600'
                              : 'border-gray-200 hover:border-purple-400 text-gray-700'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateMeals}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium text-lg disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate AI Meal Plan'}
                  </button>
                </div>
              )}

              {activeTab === 'recipe' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Generate AI-Powered Recipe</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Name or Concept</label>
                    <input
                      type="text"
                      placeholder="e.g., Quinoa Bowl, Berry Smoothie, Tofu Stir-fry"
                      value={recipeForm.name}
                      onChange={(e) => setRecipeForm({ ...recipeForm, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {dietOptions.map((diet) => (
                        <label key={diet} className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300">
                          <input
                            type="checkbox"
                            checked={recipeForm.dietaryPreferences.includes(diet)}
                            onChange={toggleArrayItem(setRecipeForm)(diet)}
                            className="w-4 h-4 text-purple-600"
                          />
                          <span className="text-sm text-gray-700 capitalize">{diet}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Excluded Ingredients</label>
                      <input
                        type="text"
                        placeholder="comma-separated: nuts, shellfish"
                        value={recipeForm.excludedIngredients.join(', ')}
                        onChange={(e) => setRecipeForm({ ...recipeForm, excludedIngredients: e.target.value.split(',').map(i => i.trim()).filter(Boolean) })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Proteins</label>
                      <input
                        type="text"
                        placeholder="e.g., chicken, tofu, fish"
                        value={recipeForm.preferredProteins.join(', ')}
                        onChange={(e) => setRecipeForm({ ...recipeForm, preferredProteins: e.target.value.split(',').map(i => i.trim()).filter(Boolean) })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={recipeForm.servings}
                        onChange={(e) => setRecipeForm({ ...recipeForm, servings: parseInt(e.target.value) || 2 })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Calories Per Serving</label>
                      <input
                        type="number"
                        value={recipeForm.maxCalories}
                        onChange={(e) => setRecipeForm({ ...recipeForm, maxCalories: parseInt(e.target.value) || 500 })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateRecipe}
                    disabled={loading || !recipeForm.name}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium text-lg disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate AI Recipe'}
                  </button>
                </div>
              )}

              {activeTab === 'optimize' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Optimize Existing Meal Plan</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meal Plan ID</label>
                    <input
                      type="number"
                      placeholder="Enter the ID of the meal plan to optimize"
                      value={optimizeForm.planId}
                      onChange={(e) => setOptimizeForm({ ...optimizeForm, planId: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Optimization Goals</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {optimizationGoalOptions.map((goal) => (
                        <label key={goal} className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300">
                          <input
                            type="checkbox"
                            checked={optimizeForm.optimizationGoals.includes(goal)}
                            onChange={toggleArrayItem((v: any) => setOptimizeForm({ ...optimizeForm, optimizationGoals: v }))(goal)}
                            className="w-4 h-4 text-purple-600"
                          />
                          <span className="text-sm text-gray-700 capitalize">{goal.replace('-', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Calories</label>
                      <input
                        type="number"
                        placeholder="Leave unchanged"
                        value={optimizeForm.targetCalories}
                        onChange={(e) => setOptimizeForm({ ...optimizeForm, targetCalories: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Protein (g)</label>
                      <input
                        type="number"
                        placeholder="Leave unchanged"
                        value={optimizeForm.targetProtein}
                        onChange={(e) => setOptimizeForm({ ...optimizeForm, targetProtein: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleOptimizePlan}
                    disabled={loading || !optimizeForm.planId}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium text-lg disabled:opacity-50"
                  >
                    {loading ? 'Optimizing...' : 'Optimize Meal Plan'}
                  </button>
                </div>
              )}

              {activeTab === 'analyze' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Analyze Meal for Dietary Compatibility</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meal Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Greek Salad with Chicken"
                      value={analyzeForm.mealName}
                      onChange={(e) => setAnalyzeForm({ ...analyzeForm, mealName: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
                    <div className="space-y-2 mb-3">
                      {analyzeForm.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="flex-1 px-3 py-2 bg-blue-50 border-2 border-blue-200 rounded-lg text-sm">
                            {ingredient}
                          </span>
                          <button
                            onClick={() => removeAnalyzeIngredient(index)}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addAnalyzeIngredient}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-purple-400"
                    >
                      + Add Ingredient
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Profiles to Check</label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {dietOptions.map((diet) => (
                        <label key={diet} className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300">
                          <input
                            type="checkbox"
                            checked={analyzeForm.dietaryProfile.includes(diet)}
                            onChange={toggleArrayItem((v: any) => setAnalyzeForm({ ...analyzeForm, dietaryProfile: v }))(diet)}
                            className="w-4 h-4 text-purple-600"
                          />
                          <span className="text-sm text-gray-700 capitalize">{diet}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAnalyzeMeal}
                    disabled={loading || !analyzeForm.mealName || analyzeForm.ingredients.length === 0}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium text-lg disabled:opacity-50"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Meal'}
                  </button>
                </div>
              )}

              {/* Results Display */}
              {result && (
                <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                  <h3 className="text-xl font-bold text-green-700 mb-4">AI Response</h3>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🤖 About AI Features
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Generate Meals:</strong> Create complete meal plans based on your dietary preferences and goals
              </li>
              <li>
                <strong>Generate Recipe:</strong> Get detailed recipes with ingredients and instructions
              </li>
              <li>
                <strong>Optimize Plan:</strong> Improve existing meal plans to better meet your nutritional targets
              </li>
              <li>
                <strong>Analyze Meal:</strong> Check if a meal fits your dietary profiles
              </li>
            </ul>
            <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Note:</strong> AI features require an OpenAI API key to be configured. 
                Without a valid API key, requests will fail. Configure <code>OPENAI_API_KEY</code> in your environment.
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
