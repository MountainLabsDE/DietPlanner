'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';
import { Navbar } from '@/components/navbar';

interface DailyTracking {
  id: string | null;
  date: string;
  caloriesConsumed: number;
  caloriesTarget: number;
  macrosConsumed: { protein: number; carbs: number; fat: number };
  macrosTarget: { protein: number; carbs: number; fat: number };
  meals: MealEntry[];
}

interface MealEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export default function TrackingPage() {
  const [tracking, setTracking] = useState<DailyTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [addingMeal, setAddingMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    loadTodayTracking();
  }, []);

  const loadTodayTracking = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTodayTracking();
      setTracking(data);
    } catch (err: any) {
      console.error('Failed to load tracking:', err);
      setError(err.message || 'Failed to load tracking data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async () => {
    if (!newMeal.name || newMeal.calories <= 0) return;

    try {
      setAddingMeal(true);
      setError(null);
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const updated = await api.addMeal({
        ...newMeal,
        time,
      }) as DailyTracking;
      setTracking(updated);
      setNewMeal({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
      setShowAddMeal(false);
    } catch (err: any) {
      console.error('Failed to add meal:', err);
      setError(err.message || 'Failed to add meal');
    } finally {
      setAddingMeal(false);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      setError(null);
      const updated = await api.deleteMealFromTracking(mealId) as DailyTracking;
      setTracking(updated);
    } catch (err: any) {
      console.error('Failed to delete meal:', err);
      setError(err.message || 'Failed to delete meal');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!tracking) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">No data available</h1>
            <p className="text-xl text-gray-600 mb-4">Create a meal plan to start tracking</p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              onClick={loadTodayTracking}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const calculateProgress = (current: number, target: number) => Math.min((current / target) * 100, 100);
  const caloriesProgress = calculateProgress(tracking.caloriesConsumed, tracking.caloriesTarget);
  const proteinProgress = calculateProgress(tracking.macrosConsumed.protein, tracking.macrosTarget.protein);
  const carbsProgress = calculateProgress(tracking.macrosConsumed.carbs, tracking.macrosTarget.carbs);
  const fatProgress = calculateProgress(tracking.macrosConsumed.fat, tracking.macrosTarget.fat);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Daily Nutrition Tracking</h1>
            <p className="text-xl text-gray-600">
              Track your daily intake and stay on target
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
            </div>
          )}

          {/* Main Progress Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Calories</h2>
                <span className="text-sm text-gray-600">
                  {tracking.caloriesConsumed} / {tracking.caloriesTarget} kcal
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    caloriesProgress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                  style={{ width: `${caloriesProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Protein</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-red-600">{tracking.macrosConsumed.protein}g</span>
                  <span className="text-sm text-gray-600">/ {tracking.macrosTarget.protein}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${proteinProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Carbs</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-yellow-600">{tracking.macrosConsumed.carbs}g</span>
                  <span className="text-sm text-gray-600">/ {tracking.macrosTarget.carbs}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${carbsProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Fat</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-blue-600">{tracking.macrosConsumed.fat}g</span>
                  <span className="text-sm text-gray-600">/ {tracking.macrosTarget.fat}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${fatProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Meals Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Today's Meals</h2>
              <button
                onClick={() => setShowAddMeal(true)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
              >
                Add Meal
              </button>
            </div>

            {showAddMeal && (
              <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Meal</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meal Name</label>
                    <input
                      type="text"
                      value={newMeal.name}
                      onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Greek Yogurt with Berries"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                      <input
                        type="number"
                        value={newMeal.calories || ''}
                        onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                      <input
                        type="number"
                        value={newMeal.protein || ''}
                        onChange={(e) => setNewMeal({ ...newMeal, protein: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                      <input
                        type="number"
                        value={newMeal.carbs || ''}
                        onChange={(e) => setNewMeal({ ...newMeal, carbs: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fat (g)</label>
                      <input
                        type="number"
                        value={newMeal.fat || ''}
                        onChange={(e) => setNewMeal({ ...newMeal, fat: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddMeal}
                      disabled={addingMeal}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingMeal ? 'Adding...' : 'Add Meal'}
                    </button>
                    <button
                      onClick={() => { setShowAddMeal(false); setNewMeal({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 }); }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {tracking.meals.map((meal) => (
                <div
                  key={meal.id}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{meal.name}</h4>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {meal.time}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>🔥 {meal.calories} kcal</span>
                        <span>💪 {meal.protein}g protein</span>
                        <span>🍞 {meal.carbs}g carbs</span>
                        <span>🥑 {meal.fat}g fat</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete meal"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {tracking.meals.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No meals logged today</p>
                <p className="text-sm mt-2">Click "Add Meal" to start tracking</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
