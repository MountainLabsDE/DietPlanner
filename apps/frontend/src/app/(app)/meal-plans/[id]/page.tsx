'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { MealPlan } from '@/types/meal-plan';
import { ProtectedRoute } from '@/components/protected-route';

export default function MealPlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (params.id) {
      loadMealPlan(params.id as string);
    }
  }, [params.id]);

  const loadMealPlan = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMealPlan(id);
      setMealPlan(data as MealPlan);
    } catch (err: any) {
      setError(err?.message || 'Failed to load meal plan');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'json') => {
    if (!mealPlan) return;
    try {
      const blob = await api.exportMealPlan(mealPlan.id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meal-plan-${mealPlan.name || 'custom'}.${format === 'pdf' ? 'pdf' : format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err?.message || 'Failed to export meal plan');
    }
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

  if (error || !mealPlan) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-lg p-">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Meal Plan Not Found
            </h2>
            <p className="text-gray-600 mb-4">{error || 'Unknown error'}</p>
            <button
              onClick={() => router.push('/meal-plans')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl"
            >
              Back to Meal Plans
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push('/meal-plans')}
              className="mb-4 text-white/80 hover:text-white flex items-center gap-2"
            >
              Back
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {mealPlan.name || 'Custom Meal Plan'}
                </h1>
                <p className="text-lg opacity-90">
                  {mealPlan.days?.length || mealPlan.config?.numberOfDays} Days - {mealPlan.config?.mealsPerDay} Meals Per Day
                </p>
              </div>
              
              {/* Export Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleExport('pdf')}
                  className="px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  PDF
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  CSV
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Error */}
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Days */}
          {mealPlan.days && mealPlan.days.map((day: any, index: number) => (
            <div
              key={day.dayNumber || index}
              className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">
                    Day {day.dayNumber || index + 1}
                  </h3>
                  {day.date && (
                    <span className="text-lg opacity-90">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Day Content */}
              <div className="p-6">
                {/* Meals */}
                <div className="space-y-4">
                  {day.meals && day.meals.map((meal: any, mealIndex: number) => (
                    <div
                      key={meal.id}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200"
                    >
                      {/* Meal Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🍽️</span>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">
                              {meal.mealType || `Meal ${mealIndex + 1}`}
                            </h4>
                          </div>
                        </div>
                        
                        {meal.recipe?.nutrition && (
                          <div className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium">
                            {meal.recipe.nutrition.calories} kcal
                          </div>
                        )}
                      </div>

                      {/* Recipe Info */}
                      {meal.recipe && (
                        <div className="space-y-3">
                          <h5 className="text-xl font-bold text-gray-900">
                            {meal.recipe.name}
                          </h5>

                          {/* Recipe Macros */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="bg-white/80 rounded-lg p-2 text-center">
                              <div className="text-base font-bold text-blue-600">
                                {meal.recipe.nutrition.protein}g
                              </div>
                              <div className="text-xs text-gray-600">Protein</div>
                            </div>
                            <div className="bg-white/80 rounded-lg p-2 text-center">
                              <div className="text-base font-bold text-yellow-600">
                                {meal.recipe.nutrition.carbs}g
                              </div>
                              <div className="text-xs text-gray-600">Carbs</div>
                            </div>
                            <div className="bg-white/80 rounded-lg p-2 text-center">
                              <div className="text-base font-bold text-green-600">
                                {meal.recipe.nutrition.fat}g
                              </div>
                              <div className="text-xs text-gray-600">Fat</div>
                            </div>
                            <div className="bg-white/80 rounded-lg p-2 text-center">
                              <div className="text-base font-bold text-gray-700">
                                {meal.recipe.prepTime}min
                              </div>
                              <div className="text-xs text-gray-600">Prep Time</div>
                            </div>
                          </div>

                          {/* Recipe Image */}
                          {meal.recipe.images && meal.recipe.images.length > 0 && (
                            <div className="relative rounded-xl overflow-hidden">
                              <img
                                src={meal.recipe.images[0]}
                                alt={meal.recipe.name}
                                className="w-full h-32 object-cover"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* No Recipe */}
                      {!meal.recipe && (
                        <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-600">
                          No recipe assigned yet
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* No Days */}
          {(!mealPlan.days || mealPlan.days.length === 0) && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center mb-6">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Days in Meal Plan
              </h3>
              <p className="text-gray-600">
                This meal plan doesn't have any days configured
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
