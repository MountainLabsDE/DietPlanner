'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/protected-route';

interface DashboardStats {
  mealPlans: number;
  dietProfiles: number;
  recipes: number;
  daysTracked: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    mealPlans: 0,
    dietProfiles: 0,
    recipes: 0,
    daysTracked: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  loadStats = async () => {
    try {
      setLoading(true);
      
      // Load diet profiles count
      const profilesData: any = await api.getDietProfiles(false, 1, 1);
      const profilesCount = profilesData.meta?.total || 0;

      // Load meal plans count
      const plansData: any = await api.getMealPlans();
      const plansCount = plansData.meta?.total || 0;

      // Load recipes count
      const recipesData: any = await api.getRecipes({ limit: 1 });
      const recipesCount = recipesData.meta?.total || 0;

      // Days tracked (placeholder for now - will be implemented with tracking feature)
      const daysTracked = 0;

      setStats({
        mealPlans: plansCount,
        dietProfiles: profilesCount,
        recipes: recipesCount,
        daysTracked,
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to access your dashboard</p>
      </div>
    }>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-2">
                <span className="text-3xl">PlatePulse</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome back, {user?.firstName}
            </h2>
            <p className="text-xl text-gray-600">
              Ready to start your nutrition journey?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <a
              href="/recipes"
              className="group bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold mb-2">
                Explore Recipes
              </h3>
              <p className="opacity-90">
                Browse delicious recipes with full nutrition info
              </p>
              <div className="mt-4 flex items-center text-sm font-medium opacity-75 group-hover:opacity-100 transition-opacity">
                Click to start
              </div>
            </a>

            <a
              href="/diet-profiles"
              className="bg-gradient-to-br from-blue-500 to-teal-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold mb-2">
                Diet Profiles
              </h3>
              <p className="opacity-90">
                Create and manage your diet preferences
              </p>
              <div className="mt-4 flex items-center text-sm font-medium opacity-75 group-hover:opacity-100 transition-opacity">
                Click to start
              </div>
            </a>

            <a
              href="/meal-plans"
              className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold mb-2">
                Meal Plans
              </h3>
              <p className="opacity-90">
                Generate infinite meal plans automatically
              </p>
              <div className="mt-4 flex items-center text-sm font-medium opacity-75">
                Click to start
              </div>
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Stats
            </h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-shadow">
                  <div className="text-4xl font-bold text-purple-600 mb-2">{stats.mealPlans}</div>
                  <div className="text-gray-600 font-medium">Meal Plans</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl border-2 border-pink-200 hover:shadow-lg transition-shadow">
                  <div className="text-4xl font-bold text-pink-600 mb-2">{stats.dietProfiles}</div>
                  <div className="text-gray-600 font-medium">Diet Profiles</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200 hover:shadow-lg transition-shadow">
                  <div className="text-4xl font-bold text-orange-600 mb-2">{stats.recipes}</div>
                  <div className="text-gray-600 font-medium">Recipes</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:shadow-lg transition-shadow">
                  <div className="text-4xl font-bold text-green-600 mb-2">{stats.daysTracked}</div>
                  <div className="text-gray-600 font-medium">Days Tracked</div>
                </div>
              </div>
            )}
          </div>

          {/* Empty State Guide */}
          {stats.dietProfiles === 0 && stats.mealPlans === 0 && !loading && (
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                👋 Welcome to PlatePulse!
              </h3>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Get started with your nutrition journey by following these steps:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                  <li>
                    <strong>Create a Diet Profile</strong> - Define your dietary preferences (Vegan, Keto, etc.), calorie targets, and restrictions
                  </li>
                  <li>
                    <strong>Explore Recipes</strong> - Browse our library of recipes with detailed nutritional information
                  </li>
                  <li>
                    <strong>Generate Meal Plans</strong> - Create personalized meal plans based on your diet profiles
                  </li>
                  <li>
                    <strong>Track Your Progress</strong> - Monitor your nutrition goals and stay motivated
                  </li>
                </ol>
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => router.push('/diet-profiles/create')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                  >
                    Create First Profile
                  </button>
                  <button
                    onClick={() => router.push('/recipes')}
                    className="px-6 py-3 bg-white text-purple-600 border-2 border-purple-300 rounded-xl font-semibold hover:bg-purple-50 transition-all"
                  >
                    Browse Recipes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
