'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { Recipe, MEAL_TYPES, DIFFICULTY_LEVELS } from '../../types/recipe';
import ProtectedRoute from '../../components/protected-route';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadRecipe(params.id as string);
    }
  }, [params.id]);

  const loadRecipe = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data: Recipe = await api.getRecipe(id);
      setRecipe(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    const level = DIFFICULTY_LEVELS.find((l: any) => l.value === parseInt(difficulty || '0'));
    return level?.color || 'bg-gray-400';
  };

  const getDifficultyLabel = (difficulty?: string) => {
    const level = DIFFICULTY_LEVELS.find((l: any) => l.value === parseInt(difficulty || '0'));
    return level?.label || 'Medium';
  };

  const getMealTypeLabel = (mealType?: string) => {
    const type = MEAL_TYPES.find((t: any) => t.value === mealType);
    return type?.label || mealType;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !recipe) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Recipe Not Found
            </h2>
            <p className="text-gray-600 mb-4">{error || 'Unknown error'}</p>
            <button
              onClick={() => router.push('/recipes')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Back to Recipes
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        {/* Hero Section */}
        <div className="relative">
          {recipe.images && recipe.images.length > 0 ? (
            <img
              src={recipe.images[0]}
              alt={recipe.name}
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <span className="text-8xl">🍽️</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Badges */}
          <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
            {recipe.mealType && (
              <span className="px-4 py-2 bg-purple-600 text-white font-bold rounded-full text-sm">
                {getMealTypeLabel(recipe.mealType)}
              </span>
            )}
            {recipe.difficulty && (
              <span className={`px-4 py-2 text-white font-bold rounded-full text-sm ${getDifficultyColor(recipe.difficulty)}`}>
                {getDifficultyLabel(recipe.difficulty)}
              </span>
            )}
          </div>

          {/* Calories Overlay */}
          <div className="absolute bottom-6 right-6">
            <div className="bg-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl">
              <div className="text-3xl font-bold">
                {recipe.nutrition.calories}
              </div>
              <div className="text-sm opacity-90">calories</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/recipes')}
            className="mb-6 px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            ← Back to Recipes
          </button>

          {/* Title and Description */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {recipe.name}
            </h1>
            
            {recipe.description && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {recipe.description}
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold">{recipe.prepTime}</div>
              <div className="text-sm opacity-90">Prep Time</div>
            </div>
            
            {recipe.cookTime && (
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-3xl mb-2">🍳</div>
                <div className="text-2xl font-bold">{recipe.cookTime}</div>
                <div className="text-sm opacity-90">Cook Time</div>
              </div>
            )}
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl mb-2">🍽️</div>
              <div className="text-2xl font-bold">{recipe.servings}</div>
              <div className="text-sm opacity-90">Servings</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl mb-2">👨‍🍳</div>
              {recipe.author && (
                <div className="text-sm font-medium">
                  {recipe.author.firstName} {recipe.author.lastName}
                </div>
              )}
              <div className="text-sm opacity-90">Chef</div>
            </div>
          </div>

          {/* Nutrition Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🥗 Nutrition Facts
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-red-50 rounded-xl p-4 text-center border-2 border-red-200">
                <div className="text-lg font-bold text-red-600 mb-1">
                  {recipe.nutrition.calories}
                </div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 text-center border-2 border-blue-200">
                <div className="text-lg font-bold text-blue-600 mb-1">
                  {recipe.nutrition.protein}g
                </div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              
              <div className="bg-yellow-50 rounded-xl p-4 text-center border-2 border-yellow-200">
                <div className="text-lg font-bold text-yellow-600 mb-1">
                  {recipe.nutrition.carbs}g
                </div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 text-center border-2 border-green-200">
                <div className="text-lg font-bold text-green-600 mb-1">
                  {recipe.nutrition.fat}g
                </div>
                <div className="text-sm text-gray-600">Fat</div>
              </div>
              
              {recipe.nutrition.fiber && (
                <div className="bg-purple-50 rounded-xl p-4 text-center border-2 border-purple-200">
                  <div className="text-lg font-bold text-purple-600 mb-1">
                    {recipe.nutrition.fiber}g
                  </div>
                  <div className="text-sm text-gray-600">Fiber</div>
                </div>
              )}
            </div>

            {/* Additional Nutrition */}
            {(recipe.nutrition.sugar || recipe.nutrition.sodium) && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {recipe.nutrition.sugar && (
                  <div className="bg-pink-50 rounded-xl p-4 flex justify-between items-center border-2 border-pink-200">
                    <span className="text-gray-700 font-medium">Sugar</span>
                    <span className="text-lg font-bold text-pink-600">
                      {recipe.nutrition.sugar}g
                    </span>
                  </div>
                )}
                
                {recipe.nutrition.sodium && (
                  <div className="bg-indigo-50 rounded-xl p-4 flex justify-between items-center border-2 border-indigo-200">
                    <span className="text-gray-700 font-medium">Sodium</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {recipe.nutrition.sodium}mg
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🥬 Ingredients
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipe.ingredients.map((ingredient: any, index: number) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200 flex items-start gap-3"
                >
                  <div className="text-2xl">🥗</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-lg">
                      {ingredient.name}
                    </div>
                    {ingredient.amount && (
                      <div className="text-purple-600 font-medium">
                        {ingredient.amount}
                      </div>
                    )}
                    {ingredient.notes && (
                      <div className="text-gray-600 text-sm mt-1">
                        {ingredient.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Steps */}
          {Array.isArray(recipe.preparationSteps) && recipe.preparationSteps.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                👨‍🍳 Preparation Steps
              </h2>
              
              <div className="space-y-6">
                {Array.isArray(recipe.preparationSteps) && recipe.preparationSteps.map((step: any, index: number) => (
                  <div
                    key={index}
                    className="flex gap-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                        {step.stepNumber || index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-lg leading-relaxed">
                        {step.instruction}
                      </p>
                      {step.durationMinutes && (
                        <div className="mt-2 text-green-600 font-medium">
                          ⏱️ {step.durationMinutes} minutes
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
