'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { MealPlan } from '@/types/meal-plan';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

export default function MealPlansPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadMealPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: any = await api.getMealPlans({
        page: currentPage,
        limit: 20,
      });

      setMealPlans(response?.items || []);
      setTotalPages(response?.meta?.totalPages || 1);
    } catch (err: any) {
      setError(err?.message || 'Failed to load meal plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMealPlans();
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meal plan?')) {
      return;
    }

    try {
      await api.deleteMealPlan(id);
      await loadMealPlans();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete meal plan');
    }
  };

  const handleExport = async (id: string, format: 'pdf' | 'csv' | 'json') => {
    try {
      const blob = await api.exportMealPlan(id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meal-plan.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err?.message || 'Failed to export meal plan');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-8 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Meal Plans</h1>
              <p className="text-lg opacity-90">
                Manage and view your personalized meal plans
              </p>
            </div>
            <button
              onClick={() => router.push('/meal-plans/generate')}
              className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <span className="text-2xl">+</span>
              Create New Plan
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Error */}
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
            </div>
          )}

          {/* No Results */}
          {!loading && mealPlans.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Meal Plans Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first meal plan to get started
              </p>
              <button
                onClick={() => router.push('/meal-plans/generate')}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Create Your First Plan
              </button>
            </div>
          )}

          {/* Meal Plans Grid */}
          {!loading && mealPlans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mealPlans.map((plan: any) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold flex-1">
                        {plan.name || 'Meal Plan'}
                      </h3>
                    </div>
                    
                    <div className="flex gap-4 text-sm opacity-90">
                      <span className="flex items-center gap-2">
                        <span>📅</span>
                        {plan.days?.length || plan.config?.numberOfDays} days
                      </span>
                      <span className="flex items-center gap-2">
                        <span>🍽️</span>
                        {plan.config?.mealsPerDay} meals/day
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-6">
                      <button
                        onClick={() => router.push(`/meal-plans/${plan.id}`)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        View Full Plan
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleExport(plan.id, 'pdf')}
                        className="flex-1 px-4 py-3 bg-red-100 text-red-700 font-semibold rounded-xl hover:bg-red-200 transition-all"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => handleExport(plan.id, 'csv')}
                        className="flex-1 px-4 py-3 bg-green-100 text-green-700 font-semibold rounded-xl hover:bg-green-200 transition-all"
                      >
                        CSV
                      </button>
                      <button
                        onClick={() => handleExport(plan.id, 'json')}
                        className="flex-1 px-4 py-3 bg-blue-100 text-blue-700 font-semibold rounded-xl hover:bg-blue-200 transition-all"
                      >
                        JSON
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="w-full mt-3 px-4 py-3 bg-gray-100 text-red-600 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                    >
                      Delete Plan
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Created: {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    currentPage === i + 1
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
