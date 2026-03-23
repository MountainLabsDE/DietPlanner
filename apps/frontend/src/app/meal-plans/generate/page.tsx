'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { VARIETY_OPTIONS, MEALS_PER_DAY_OPTIONS, DAYS_OPTIONS, MEAL_TYPE_OPTIONS } from '@/types/meal-plan';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

export default function GenerateMealPlanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dietProfileId, setDietProfileId] = useState<string>('');
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [variety, setVariety] = useState('medium');
  const [dailyCalories, setDailyCalories] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dietProfileId) {
      setError('Please select a diet profile');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const config: any = {
        dietProfileId,
        mealsPerDay,
        numberOfDays,
        variety,
      };
      
      if (dailyCalories) {
        config.dailyCalories = parseInt(dailyCalories);
      }

      const response = await api.generateMealPlan(config);

      if (response && (response as any).id) {
        router.push(`/meal-plans/${(response as any).id}`);
      } else {
        throw new Error('Failed to create meal plan');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to generate meal plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.back()}
              className="mb-4 text-white/80 hover:text-white flex items-center gap-2"
            >
              Back
            </button>
            <h1 className="text-4xl font-bold mb-2">Generate Meal Plan</h1>
            <p className="text-lg opacity-90">
              Create a personalized meal plan based on your diet preferences
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <form onSubmit={handleGenerate} className="space-y-8">
            {/* Diet Profile */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                Profile
                Select Diet Profile
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Choose Your Diet Profile
                  </label>
                  <select
                    value={dietProfileId}
                    onChange={(e) => setDietProfileId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    required
                  >
                    <option value="">Select a diet profile...</option>
                    <option value="profile-1">Vegan - Balanced</option>
                    <option value="profile-2">Keto - Low Carb</option>
                    <option value="profile-3">Vegan Keto - Low Carb Plant-Based</option>
                    <option value="profile-4">Paleo</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-600">
                    Create a diet profile in the Diet Profiles section if you haven&apos;t already
                  </p>
                </div>
              </div>
            </div>

            {/* Meals Per Day */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                Food
                Meals Per Day
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MEALS_PER_DAY_OPTIONS.map((option: any) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMealsPerDay(option.value)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      mealsPerDay === option.value
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {option.value}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {(option.meals || []).map((m: any) => MEAL_TYPE_OPTIONS.find((mt: any) => mt.value === m)?.label || m).join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Days */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                Calendar
                Plan Duration
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {DAYS_OPTIONS.map((option: any) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setNumberOfDays(option.value)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      numberOfDays === option.value
                        ? 'border-pink-500 bg-pink-50 shadow-lg'
                        : 'border-pink-200 bg-white hover:border-pink-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-4xl font-bold text-pink-600 mb-2">
                      {option.value}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Variety */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                Random
                Meal Variety
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {VARIETY_OPTIONS.map((option: any) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setVariety(option.value)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      variety === option.value
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-orange-200 bg-white hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-xl font-bold text-orange-600 mb-2">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Calories (Optional) */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                Fire
                Daily Calorie Target (Optional)
              </h2>
              
              <div className="max-w-md">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Enter your daily calorie target or leave empty to use diet profile defaults
                </label>
                <input
                  type="number"
                  value={dailyCalories}
                  onChange={(e) => setDailyCalories(e.target.value)}
                  placeholder="e.g., 2000"
                  min="1000"
                  max="5000"
                  step="100"
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                />
                <p className="mt-2 text-sm text-gray-600">
                  Typically 1600-2400 calories depending on your goals
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !dietProfileId}
                className="px-12 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Generating Meal Plan...
                  </div>
                ) : (
                  'Generate Meal Plan Now'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
